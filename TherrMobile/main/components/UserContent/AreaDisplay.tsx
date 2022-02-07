
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    Text,
    TouchableWithoutFeedbackComponent,
    View,
} from 'react-native';
import { Button, Image } from 'react-native-elements';
import Autolink from 'react-native-autolink';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IUserState } from 'therr-react/types';
import UserMedia from './UserMedia';
import HashtagsContainer from './HashtagsContainer';
import { ITherrThemeColors } from '../../styles/themes';
import sanitizeNotificationMsg from '../../utilities/sanitizeNotificationMsg';

const { width: viewportWidth } = Dimensions.get('window');

interface IUserDetails {
    userName: string;
}

interface IAreaDisplayProps {
    translate: Function;
    date: string;
    toggleAreaOptions: Function;
    hashtags: any[];
    isDarkMode: boolean;
    isExpanded?: boolean;
    area: any;
    areaMedia: string;
    goToViewUser: Function;
    updateAreaReaction: Function;
    user: IUserState;
    userDetails: IUserDetails;
    theme: {
        styles: any;
        colors: ITherrThemeColors;
    };
    themeForms: {
        styles: any;
        colors: ITherrThemeColors;
    };
    themeViewArea: {
        styles: any;
        colors: ITherrThemeColors;
    };
}

interface IAreaDisplayState {
}

export default class AreaDisplay extends React.Component<IAreaDisplayProps, IAreaDisplayState> {
    constructor(props: IAreaDisplayProps) {
        super(props);

        this.state = {
        };
    }

    onBookmarkPress = (area) => {
        const { updateAreaReaction, userDetails } = this.props;

        updateAreaReaction(area.id, {
            userBookmarkCategory: !!area.reaction?.userBookmarkCategory ? null : 'Uncategorized',
        }, area.fromUserId, userDetails.userName);
    }

    render() {
        const {
            date,
            toggleAreaOptions,
            hashtags,
            isDarkMode,
            isExpanded,
            area,
            areaMedia,
            goToViewUser,
            userDetails,
            theme,
            themeForms,
            themeViewArea,
        } = this.props;

        const isBookmarked = area.reaction?.userBookmarkCategory;

        return (
            <>
                <View style={themeViewArea.styles.areaAuthorContainer}>
                    <Pressable
                        onPress={() => goToViewUser(area.fromUserId)}
                    >
                        <Image
                            source={{ uri: `https://robohash.org/${area.fromUserId}?size=52x52` }}
                            style={themeViewArea.styles.areaUserAvatarImg}
                            containerStyle={themeViewArea.styles.areaUserAvatarImgContainer}
                            PlaceholderContent={<ActivityIndicator size="large" color={theme.colors.primary}/>}
                            transition={false}
                        />
                    </Pressable>
                    <View style={themeViewArea.styles.areaAuthorTextContainer}>
                        {
                            userDetails &&
                                <Text style={themeViewArea.styles.areaUserName}>
                                    {`${userDetails.userName}`}
                                </Text>
                        }
                        <Text style={themeViewArea.styles.dateTime}>
                            {date}
                        </Text>
                    </View>
                    <Button
                        containerStyle={themeViewArea.styles.moreButtonContainer}
                        buttonStyle={themeViewArea.styles.moreButton}
                        icon={
                            <Icon
                                name="more-horiz"
                                size={24}
                                color={isDarkMode ? theme.colors.textWhite : theme.colors.tertiary}
                            />
                        }
                        onPress={() => toggleAreaOptions(area)}
                        type="clear"
                        TouchableComponent={TouchableWithoutFeedbackComponent}
                    />
                </View>
                <UserMedia
                    viewportWidth={viewportWidth}
                    media={areaMedia}
                    isVisible={areaMedia}
                />
                <View style={themeViewArea.styles.areaContentTitleContainer}>
                    <Text
                        style={themeViewArea.styles.areaContentTitle}
                        numberOfLines={2}
                    >
                        {sanitizeNotificationMsg(area.notificationMsg)}
                    </Text>
                    <Button
                        containerStyle={themeViewArea.styles.bookmarkButtonContainer}
                        buttonStyle={themeViewArea.styles.bookmarkButton}
                        icon={
                            <Icon
                                name={ isBookmarked ? 'bookmark' : 'bookmark-border' }
                                size={24}
                                color={isDarkMode ? theme.colors.textWhite : theme.colors.tertiary}
                            />
                        }
                        onPress={() => this.onBookmarkPress(area)}
                        type="clear"
                        TouchableComponent={TouchableWithoutFeedbackComponent}
                    />
                </View>
                <Text style={themeViewArea.styles.areaMessage} numberOfLines={3}>
                    <Autolink
                        text={area.message}
                        linkStyle={theme.styles.link}
                        phone="sms"
                    />
                </Text>
                <View>
                    <HashtagsContainer
                        hasIcon={false}
                        hashtags={hashtags}
                        onHashtagPress={() => {}}
                        visibleCount={isExpanded ? 20 : 5}
                        right
                        styles={themeForms.styles}
                    />
                </View>
            </>
        );
    }
}