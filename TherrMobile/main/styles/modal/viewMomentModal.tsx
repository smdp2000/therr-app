import { StyleSheet } from 'react-native';
import * as therrTheme from '../themes';

const containerBackgroundColor = therrTheme.colors.textWhite;
// const brandingYellow = '#ebc300';

export default StyleSheet.create({
    buttons: {
        backgroundColor: 'transparent',
        height: 50,
    },
    buttonsActive: {
        backgroundColor: 'transparent',
        height: 50,
    },
    buttonsTitle: {
        backgroundColor: 'transparent',
        color: therrTheme.colors.secondary,
        paddingRight: 10,
        paddingLeft: 10,
    },
    buttonsTitleActive: {
        backgroundColor: 'transparent',
        color: therrTheme.colors.secondary,
        paddingRight: 10,
        paddingLeft: 10,
    },
    iconStyle: {
        color: therrTheme.colors.secondary,
        // position: 'absolute',
        // left: 20
    },
    container: {
        backgroundColor: containerBackgroundColor,
        display: 'flex',
        height: '100%',
        width: '92%',
        alignSelf: 'flex-end',
        flexDirection: 'column',
        borderRadius: 0,
        padding: 0,
    },
    header: {
        marginTop: 4,
        marginBottom: 4,
        paddingBottom: 4,
        display: 'flex',
        flexDirection: 'row',
        color: therrTheme.colors.secondary,
        borderBottomWidth: 2,
        borderBottomColor: '#4950571c',
        backgroundColor: therrTheme.colors.beemo1,
    },
    headerTitle: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        marginLeft: 20,
    },
    headerTitleText: {
        color: 'black',
        fontSize: 20,
        letterSpacing: 3,
    },
    headerTitleIcon: {
        color: 'black',
        marginRight: 10,
    },
    body: {
        position: 'relative',
        flex: 1,
        margin: 10,
        marginTop: 15,
        backgroundColor: therrTheme.colors.beemo1,
    },
    momentContainer: {
        display: 'flex',
        marginTop: 0,
        marginBottom: 4,
        padding: 20,
        paddingBottom: 4,
        paddingTop: 4,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    momentMessage: {
        fontSize: 20,
    },
    momentUserAvatarImg: {
        height: 200,
        width: 200,
        borderRadius: 100,
        marginBottom: 12,
    },
    momentUserName: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 14,
    },
    footer: {
        display: 'flex',
        flex: 1,
        padding: 40,
        paddingBottom: 8,
        position: 'absolute',
        bottom: 0,
        alignItems: 'flex-end',
        width: '100%',
    },
    toggleIcon: {
        color: therrTheme.colors.textWhite,
    },
});