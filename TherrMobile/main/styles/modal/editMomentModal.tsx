import { StyleSheet } from 'react-native';
import * as therrTheme from '../themes/ocean';

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
    },
    footer: {
        display: 'flex',
        paddingBottom: 8,
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        width: '100%',
    },
    toggleIcon: {
        color: therrTheme.colors.textWhite,
    },
});
