import React, { PureComponent, Fragment } from 'react';
import { View, ScrollView } from 'react-native';
import { injectIntl } from 'react-intl';

// Components
import ScrollableTabView from '@esteemapp/react-native-scrollable-tab-view';
import { Comments } from '../../../components/comments';
import { CollapsibleCard } from '../../../components/collapsibleCard';
import { Header } from '../../../components/header';
import { NoPost, ProfileSummaryPlaceHolder } from '../../../components/basicUIElements';
import { Posts } from '../../../components/posts';
import { ProfileSummary } from '../../../components/profileSummary';
import { TabBar } from '../../../components/tabBar';
import { Wallet } from '../../../components/wallet';
import { PROFILE_FILTERS } from '../../../constants/options/filters';

// Utilitites
import { getFormatedCreatedDate } from '../../../utils/time';
import { getRcPower, getVotingPower } from '../../../utils/manaBar';

// Styles
import styles from './profileStyles';

class ProfileScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSummaryOpen: true,
      collapsibleMoreHeight: 0,
    };
  }

  _handleOnScroll = () => {
    const { isSummaryOpen } = this.state;

    if (isSummaryOpen) this.setState({ isSummaryOpen: false });
  };

  _handleOnSummaryExpanded = () => {
    const { isSummaryOpen } = this.state;

    if (!isSummaryOpen) this.setState({ isSummaryOpen: true });
  };

  _handleUIChange = (height) => {
    this.setState({ collapsibleMoreHeight: height });
  };

  render() {
    const {
      about,
      comments,
      follows,
      handleFollowUnfollowUser,
      handleMuteUnmuteUser,
      handleOnFollowsPress,
      intl,
      isDarkTheme,
      isFollowing,
      isLoggedIn,
      isMuted,
      isProfileLoading,
      isReady,
      isReverseHeader,
      selectedQuickProfile,
      user,
      username,
    } = this.props;

    const { isSummaryOpen, collapsibleMoreHeight } = this.state;

    let _about;
    let coverImage;
    let location;
    let website;
    let votingPower;
    let resourceCredits;
    let fullInHourVP;
    let fullInHourRC;

    if (user) {
      votingPower = getVotingPower(user).toFixed(1);
      resourceCredits = getRcPower(user).toFixed(1);
      fullInHourVP = Math.ceil((100 - votingPower) * 0.833333);
      fullInHourRC = Math.ceil((100 - resourceCredits) * 0.833333);
    }

    if (about) {
      _about = about.about;
      coverImage = about.cover_image;
      location = about.location;
      website = about.website;
    }
    return (
      <Fragment>
        <Header
          key={selectedQuickProfile && selectedQuickProfile.name}
          selectedUser={selectedQuickProfile}
          isReverse={isReverseHeader}
        />
        <View style={styles.container}>
          {!isReady ? (
            <ProfileSummaryPlaceHolder />
          ) : (
            <CollapsibleCard
              title={_about}
              isTitleCenter
              defaultTitle={intl.formatMessage({
                id: 'profile.details',
              })}
              expanded
              isExpanded={isSummaryOpen}
              handleOnExpanded={this._handleOnSummaryExpanded}
              moreHeight={collapsibleMoreHeight}
              // expanded={isLoggedIn}
              // locked={!isLoggedIn}
            >
              <ProfileSummary
                coverImage={coverImage}
                date={getFormatedCreatedDate(user && user.created)}
                followerCount={follows.follower_count}
                followingCount={follows.following_count}
                handleFollowUnfollowUser={handleFollowUnfollowUser}
                handleMuteUnmuteUser={handleMuteUnmuteUser}
                handleOnFollowsPress={handleOnFollowsPress}
                hoursRC={fullInHourRC || null}
                hoursVP={fullInHourVP || null}
                intl={intl}
                isDarkTheme={isDarkTheme}
                isFollowing={isFollowing}
                isLoggedIn={isLoggedIn}
                isMuted={isMuted}
                isOwnProfile={!isReverseHeader}
                isProfileLoading={isProfileLoading}
                link={website}
                location={location}
                percentRC={resourceCredits}
                percentVP={votingPower}
                handleUIChange={this._handleUIChange}
              />
            </CollapsibleCard>
          )}

          <ScrollableTabView
            style={styles.tabView}
            renderTabBar={() => (
              <TabBar style={styles.tabbar} tabUnderlineDefaultWidth={80} tabUnderlineScaleX={2} />
            )}
          >
            <View
              tabLabel={intl.formatMessage({
                id: 'profile.post',
              })}
              style={styles.postTabBar}
            >
              <Posts
                filterOptions={PROFILE_FILTERS}
                selectedOptionIndex={0}
                pageType="profiles"
                getFor="blog"
                tag={username}
                key={username}
                handleOnScroll={this._handleOnScroll}
              />
            </View>
            <View
              tabLabel={intl.formatMessage({
                id: 'profile.replies',
              })}
              style={styles.commentsTabBar}
            >
              {comments && comments.length > 0 ? (
                <ScrollView>
                  <Comments isProfilePreview comments={comments} />
                </ScrollView>
              ) : (
                <NoPost
                  name={username}
                  text={intl.formatMessage({
                    id: 'profile.havent_commented',
                  })}
                  defaultText={intl.formatMessage({
                    id: 'profile.login_to_see',
                  })}
                />
              )}
            </View>
            <View
              tabLabel={intl.formatMessage({
                id: 'profile.wallet',
              })}
            >
              <Wallet user={user} intl={intl} />
            </View>
          </ScrollableTabView>
        </View>
      </Fragment>
    );
  }
}

export default injectIntl(ProfileScreen);
