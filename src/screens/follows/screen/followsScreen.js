import React, { Component } from 'react';
import {
  View, Text, FlatList, ActivityIndicator,
} from 'react-native';
// Constants

// Components
import { EditorHeader } from '../../../components/editorHeader';
import { UserListItem } from '../../../components/basicUIElements';

// Utils
import styles from './followScreenStyles';

class FollowsScreen extends Component {
  /* Props
    * ------------------------------------------------
    *   @prop { type }    name                - Description....
    */

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  // Component Life Cycles

  // Component Functions

  _renderItem = (item, index) => {
    const { handleOnUserPress, isFollowing } = this.props;
    const username = isFollowing ? item.following : item.follower;
    const avatar = `https://steemitimages.com/u/${username}/avatar/small`;
    return (
      <UserListItem
        handleOnUserPress={handleOnUserPress}
        avatar={avatar}
        index={index}
        username={username}
      />
    );
  };

  _renderFooter = () => {
    const { isLoading } = this.props;

    if (isLoading) {
      return (
        <View style={styles.flatlistFooter}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }
    return null;
  };

  render() {
    const {
      loadMore, data, isFollowers, count, filterResult, handleSearch,
    } = this.props;
    const title = !isFollowers ? 'Followers' : 'Following';
    const headerTitle = `${title} (${count})`;

    return (
      <View style={{ flex: 1, padding: 8 }}>
        <EditorHeader
          title={headerTitle}
          rightIconName="ios-search"
          isHasSearch
          handleOnSearch={handleSearch}
        />
        {true || (filterResult && data && filterResult.length > 0) || data.length > 0 ? (
          <FlatList
            data={filterResult || data}
            keyExtractor={item => item.voter}
            onEndReached={loadMore}
            removeClippedSubviews={false}
            renderItem={({ item, index }) => this._renderItem(item, index)}
            ListFooterComponent={this._renderFooter}
          />
        ) : (
          <Text style={styles.text}>No user found.</Text>
        )}
      </View>
    );
  }
}

export default FollowsScreen;