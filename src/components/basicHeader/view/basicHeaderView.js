import React, { Component, Fragment } from 'react';
import {
  View, Text, TextInput, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { injectIntl } from 'react-intl';

// Components
import { TextButton } from '../..';
import { IconButton } from '../../iconButton';
import { DropdownButton } from '../../dropdownButton';

// Constants
// Styles
import styles from './basicHeaderStyles';

class BasicHeaderView extends Component {
  /* Props
   * ------------------------------------------------
   *   @prop { boolean }    isFormValid                - Righst button propertie
   *   @prop { string }     quickTitle                 - Left side behind back button text
   */

  constructor(props) {
    super(props);
    this.state = {
      isInputVisible: false,
    };
  }

  // Component Life Cycles

  // Component Functions

  _handleOnPress = () => {
    const { handleOnSubmit } = this.props;

    if (handleOnSubmit) {
      handleOnSubmit();
    }
  };

  _handleOnDropdownSelect = () => {};

  _handleSearchButtonPress = () => {
    const { isInputVisible } = this.state;

    this.setState({ isInputVisible: !isInputVisible });
  };

  _handleOnSearch = (value) => {
    const { handleOnSearch } = this.props;

    handleOnSearch(value);
  };

  _handleOnInputChange = () => {};

  render() {
    const {
      dropdownComponent,
      handleOnPressBackButton,
      handleOnPressClose,
      handleOnPressPreviewButton,
      handleOnSaveButtonPress,
      handleRightIconPress,
      intl,
      isDraftSaved,
      isDraftSaving,
      isFormValid,
      isHasDropdown,
      isHasIcons,
      isHasSearch,
      isLoading,
      isLoggedIn,
      isModalHeader,
      isPostSending,
      rightButtonText,
      isPreviewActive,
      isReply,
      quickTitle,
      rightIconName,
      title,
    } = this.props;
    const { isInputVisible } = this.state;
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.backWrapper}>
            <IconButton
              iconStyle={[styles.backIcon, isModalHeader && styles.closeIcon]}
              iconType="MaterialIcons"
              name={isModalHeader ? 'arrow-back' : 'arrow-back'}
              onPress={() => (isModalHeader ? handleOnPressClose() : handleOnPressBackButton())}
            />
            {isHasIcons && !isReply && (
              <View>
                {!isDraftSaving ? (
                  <IconButton
                    iconStyle={[styles.saveIcon, isDraftSaved && styles.savedIcon]}
                    iconType="MaterialIcons"
                    name="save"
                    size={25}
                    onPress={() => handleOnSaveButtonPress && handleOnSaveButtonPress()}
                  />
                ) : (
                  <ActivityIndicator style={styles.textButtonWrapper} />
                )}
              </View>
            )}

            {!isInputVisible && (
              <Text style={[title && styles.title, quickTitle && styles.quickTitle]}>
                {quickTitle || title}
              </Text>
            )}

            {isHasDropdown && (
              <View>
                {dropdownComponent ? (
                  <Fragment>{dropdownComponent}</Fragment>
                ) : (
                  <DropdownButton
                    isHasChildIcon
                    iconName="md-more"
                    options={[
                      'ALL ACTIVITIES',
                      'VOTES',
                      'REPLIES',
                      'MENTIONS',
                      'FOLLOWS',
                      'REBLOGS',
                    ]}
                    onSelect={this._handleOnDropdownSelect}
                  />
                )}
              </View>
            )}

            {rightIconName && !isHasSearch && (
              <IconButton
                style={styles.rightIcon}
                size={25}
                onPress={() => handleRightIconPress()}
                iconStyle={styles.rightIcon}
                name={rightIconName}
              />
            )}

            {isInputVisible && (
              <TextInput
                onChangeText={value => this._handleOnSearch(value)}
                autoFocus
                placeholder={intl.formatMessage({
                  id: 'basic_header.search',
                })}
                autoCapitalize="none"
                style={styles.textInput}
              />
            )}

            {isHasSearch && (
              <IconButton
                style={styles.rightIcon}
                size={25}
                onPress={() => this._handleSearchButtonPress()}
                iconStyle={styles.rightIcon}
                name={rightIconName}
              />
            )}
          </View>

          {isHasIcons && (
            <Fragment>
              {/* <IconButton
                style={styles.iconButton}
                iconStyle={styles.rightIcon}
                size={20}
                iconType="MaterialIcons"
                name="timer"
              /> */}
              <IconButton
                style={styles.iconButton}
                size={25}
                onPress={() => handleOnPressPreviewButton()}
                iconStyle={styles.rightIcon}
                iconType="MaterialIcons"
                name={isPreviewActive ? 'remove-red-eye' : 'remove-red-eye'}
              />
              {!isLoading ? (
                <TextButton
                  textStyle={[
                    styles.textButton,
                    isFormValid && isLoggedIn ? styles.textButtonEnable : styles.textButtonDisable,
                  ]}
                  onPress={isFormValid && this._handleOnPress}
                  style={styles.textButtonWrapper}
                  text={rightButtonText}
                />
              ) : (
                <ActivityIndicator style={[styles.textButtonWrapper]} />
              )}
            </Fragment>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default injectIntl(BasicHeaderView);
