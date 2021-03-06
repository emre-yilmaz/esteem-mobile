import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

import FastImage from 'react-native-fast-image';

// Components
import { Tag, TextWithIcon } from '../../../basicUIElements';

// Styles
import styles from './postHeaderDescriptionStyles';

import { default as ROUTES } from '../../../../constants/routeNames';

// Constants
const DEFAULT_IMAGE = require('../../../../assets/esteem.png');

class PostHeaderDescription extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycles

  // Component Functions
  _handleOnUserPress = (username) => {
    const { navigation, profileOnPress, reputation } = this.props;

    if (profileOnPress) {
      profileOnPress(username);
    } else {
      navigation.navigate({
        routeName: ROUTES.SCREENS.PROFILE,
        params: {
          username,
          reputation,
        },
        key: username,
      });
    }
  };

  render() {
    const {
      avatar,
      date,
      isHideImage,
      name,
      reblogedBy,
      reputation,
      size,
      tag,
      tagOnPress,
    } = this.props;

    const _reputationText = `(${reputation})`;
    let _avatar;

    if (isHideImage) {
      _avatar = null;
    } else {
      _avatar = avatar && { uri: avatar };
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.avatarNameWrapper}
          onPress={() => this._handleOnUserPress(name)}
        >
          {_avatar && (
            <FastImage
              style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
              source={_avatar}
              defaultSource={DEFAULT_IMAGE}
            />
          )}
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.reputation}>{_reputationText}</Text>
        </TouchableOpacity>
        {tag && (
          <TouchableOpacity onPress={() => tagOnPress && tagOnPress()}>
            <Tag isPostCardTag isPin value={tag} />
          </TouchableOpacity>
        )}
        <Text style={styles.date}>{date}</Text>
        {!!reblogedBy && <TextWithIcon text={reblogedBy} iconType="MaterialIcons" iconName="repeat" />}
      </View>
    );
  }
}

export default withNavigation(PostHeaderDescription);
