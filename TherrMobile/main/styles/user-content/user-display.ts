import { StyleSheet } from 'react-native';
import * as therrTheme from '../themes';

export default StyleSheet.create({
    // Main
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },

    // Action Menu
    actionMenuContainer: {
        width: '100%',
        marginTop: 10,
    },
    actionMenuItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionMenuItemIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
        marginHorizontal: 4,
    },
    actionMenuItemText: {
        color: therrTheme.colorVariations.beemoTextWhiteFade,
        fontSize: 16,
        flex: 1,
        paddingRight: 10,
    },
    separator: {
        width: '94%',
        marginHorizontal: '3%',
        height: 2,
        backgroundColor: therrTheme.colorVariations.beemo1Fade,
    },

    // Profile Picture
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
});