import * as dsteem from 'dsteem';
import { getUser } from './dsteem';
import {
  setUserData,
  setAuthStatus,
  getUserDataWithUsername,
  updateUserData,
  updateCurrentUsername,
  getUserData,
  setSCAccount,
  getSCAccount,
} from '../../realm/realm';
import { encryptKey, decryptKey } from '../../utils/crypto';
import steemConnect from './steemConnectAPI';
import { getSCAccessToken } from '../esteem/esteem';

export const login = async (username, password) => {
  const resultKeys = {
    active: null,
    memo: null,
    owner: null,
    posting: null,
  };
  let loginFlag = false;
  let avatar = '';
  // Get user account data from STEEM Blockchain
  const account = await getUser(username);
  if (!account) {
    return Promise.reject(new Error('Invalid pin code, please check and try again'));
  }
  if (isLoggedInUser(username)) {
    return Promise.reject(
      new Error('You are already logged in, please try to add another account'),
    );
  }

  // Public keys of user
  const publicKeys = {
    active: account.active.key_auths.map(x => x[0]),
    memo: account.memo_key,
    owner: account.owner.key_auths.map(x => x[0]),
    posting: account.posting.key_auths.map(x => x[0]),
  };

  // Set private keys of user
  const privateKeys = getPrivateKeys(username, password);

  // Check all keys
  Object.keys(publicKeys).map((pubKey) => {
    if (publicKeys[pubKey] === privateKeys[pubKey].createPublic().toString()) {
      loginFlag = true;
      resultKeys[pubKey] = publicKeys[pubKey];
    }
  });

  let jsonMetadata;
  try {
    jsonMetadata = JSON.parse(account.json_metadata) || '';
  } catch (err) {
    jsonMetadata = '';
  }
  if (Object.keys(jsonMetadata).length !== 0) {
    avatar = jsonMetadata.profile.profile_image || '';
  }
  if (loginFlag) {
    const userData = {
      username,
      avatar,
      authType: 'masterKey',
      masterKey: '',
      postingKey: '',
      activeKey: '',
      memoKey: '',
      accessToken: '',
    };

    account.local = userData;

    // Save user data to Realm DB
    await setUserData(userData);
    await updateCurrentUsername(account.name);
    return { ...account, password };
  }
  return Promise.reject(new Error('Invalid pin code, please check and try again'));
};

export const loginWithSC2 = async (code) => {
  const scTokens = await getSCAccessToken(code);
  await setSCAccount(scTokens);
  await steemConnect.setAccessToken(scTokens.access_token);
  const account = await steemConnect.me();
  let avatar = '';

  return new Promise((resolve, reject) => {
    try {
      const jsonMetadata = JSON.parse(account.account.json_metadata);
      if (Object.keys(jsonMetadata).length !== 0) {
        avatar = jsonMetadata.profile.profile_image || '';
      }
    } catch (error) {
      reject(new Error('Invalid credentials, please check and try again'));
    }
    const userData = {
      username: account.account.name,
      avatar,
      authType: 'steemConnect',
      masterKey: '',
      postingKey: '',
      activeKey: '',
      memoKey: '',
      accessToken: '',
    };

    if (isLoggedInUser(account.account.name)) {
      reject(new Error('You are already logged in, please try to add another account'));
    }

    setUserData(userData)
      .then(() => {
        account.account.username = account.account.name;
        updateCurrentUsername(account.account.name);
        resolve({ ...account.account, accessToken: scTokens.access_token });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const setUserDataWithPinCode = async (data) => {
  const result = getUserDataWithUsername(data.username);
  const userData = result[0];

  const privateKeys = getPrivateKeys(userData.username, data.password);

  const updatedUserData = {
    username: userData.username,
    authType: userData.authType,
    accessToken:
      userData.authType === 'steemConnect' ? encryptKey(data.accessToken, data.pinCode) : '',
    masterKey: userData.authType === 'masterKey' ? encryptKey(data.password, data.pinCode) : '',
    postingKey: encryptKey(privateKeys.posting.toString(), data.pinCode),
    activeKey: encryptKey(privateKeys.active.toString(), data.pinCode),
    memoKey: encryptKey(privateKeys.memo.toString(), data.pinCode),
  };

  const response = await updateUserData(updatedUserData);
  const authData = {
    isLoggedIn: true,
    currentUsername: userData.username,
  };

  await setAuthStatus(authData);
  return response;
};

export const updatePinCode = async (data) => {
  let password = null;
  let accessToken = null;
  const users = await getUserData();
  if (users.length > 0) {
    users.forEach(async (userData) => {
      if (userData.authType === 'masterKey') {
        password = decryptKey(userData.masterKey, data.oldPinCode);
      } else if (userData.authType === 'steemConnect') {
        accessToken = decryptKey(userData.accessToken, data.oldPinCode);
      }
      const privateKeys = getPrivateKeys(userData.username, password);
      const updatedUserData = {
        username: userData.username,
        authType: userData.authType,
        accessToken:
          userData.authType === 'steemConnect' ? encryptKey(accessToken, data.pinCode) : '',
        masterKey: userData.authType === 'masterKey' ? encryptKey(password, data.pinCode) : '',
        postingKey: encryptKey(privateKeys.posting.toString(), data.pinCode),
        activeKey: encryptKey(privateKeys.active.toString(), data.pinCode),
        memoKey: encryptKey(privateKeys.memo.toString(), data.pinCode),
      };
      const response = await updateUserData(updatedUserData);
      const authData = {
        isLoggedIn: true,
        currentUsername: userData.username,
      };

      await setAuthStatus(authData);
      return response;
    });
  }
};

export const verifyPinCode = async (data) => {
  const result = getUserDataWithUsername(data.username);
  const userData = result[0];
  let account = null;
  let loginFlag = false;
  if (result.length > 0) {
    if (userData.authType === 'steemConnect') {
      let accessToken;
      try {
        accessToken = decryptKey(userData.accessToken, data.pinCode);
      } catch (error) {
        return Promise.reject(new Error('Invalid pin code, please check and try again'));
      }

      const scAccount = await getSCAccount(userData.username);
      const now = new Date();
      const expireDate = new Date(scAccount.expireDate);
      if (now >= expireDate) {
        const newSCAccountData = await getSCAccessToken(scAccount.refreshToken);
        await setSCAccount(newSCAccountData);
        accessToken = newSCAccountData.access_token;
        await updateUserData(
          { ...userData, accessToken: encryptKey(accessToken, data.pinCode) },
        );
      }
      await steemConnect.setAccessToken(accessToken);
      account = await steemConnect.me();
      if (account) {
        loginFlag = true;
      }
    } else if (userData.authType === 'masterKey') {
      const password = decryptKey(userData.masterKey, data.pinCode);
      account = await getUser(data.username);
      // Public keys of user
      const publicKeys = {
        active: account.active.key_auths.map(x => x[0]),
        memo: account.memo_key,
        owner: account.owner.key_auths.map(x => x[0]),
        posting: account.posting.key_auths.map(x => x[0]),
      };
      // Set private keys of user
      const privateKeys = getPrivateKeys(data.username, password);

      // Check all keys
      Object.keys(publicKeys).map((pubKey) => {
        if (publicKeys[pubKey] === privateKeys[pubKey].createPublic().toString()) {
          loginFlag = true;
        }
      });
    }
  }
  if (loginFlag) {
    const authData = {
      isLoggedIn: true,
      currentUsername: data.username,
    };
    const response = {
      accessToken: decryptKey(userData.accessToken, data.pinCode),
      postingKey: decryptKey(userData.postingKey, data.pinCode),
      masterKey: decryptKey(userData.masterKey, data.pinCode),
      activeKey: decryptKey(userData.activeKey, data.pinCode),
      memoKey: decryptKey(userData.memoKey, data.pinCode),
    };
    await setAuthStatus(authData);
    return response;
  }
  return Promise.reject(new Error('Invalid pin code, please check and try again'));
};

export const switchAccount = username => new Promise((resolve, reject) => {
  getUser(username)
    .then((account) => {
      updateCurrentUsername(username)
        .then(() => {
          resolve(account);
        })
        .catch(() => {
          reject(new Error('Unknown error, please contact to eSteem.'));
        });
    })
    .catch(() => {
      reject(new Error('Unknown error, please contact to eSteem.'));
    });
});

const getPrivateKeys = (username, password) => ({
  active: dsteem.PrivateKey.fromLogin(username, password, 'active'),
  memo: dsteem.PrivateKey.fromLogin(username, password, 'memo'),
  owner: dsteem.PrivateKey.fromLogin(username, password, 'owner'),
  posting: dsteem.PrivateKey.fromLogin(username, password, 'posting'),
});

const isLoggedInUser = (username) => {
  const result = getUserDataWithUsername(username);
  if (result.length > 0) {
    return true;
  }
  return false;
};
