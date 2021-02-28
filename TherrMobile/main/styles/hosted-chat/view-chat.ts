import { StyleSheet } from 'react-native';
import * as therrTheme from '../themes';

export default StyleSheet.create({
    container: {
        marginTop: 0,
        marginBottom: 80,
    },
    sendBtnContainer: {
        marginHorizontal: 0,
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 3,
        backgroundColor: therrTheme.colorVariations.beemoTextWhiteFade,
        paddingHorizontal: 4,
        paddingVertical: 10,
        borderRadius: 4,
        elevation: 3,
        borderLeftWidth: 5,
        paddingLeft: 10,
    },
    senderSuffixText: {
        color: therrTheme.colors.beemoTextBlack,
        fontSize: 15,
        fontWeight: 'bold',
    },
    messageText: {
        color: therrTheme.colors.beemoTextBlack,
        fontSize: 15,
        flex: 1,
    },
    footer: {
        paddingHorizontal: 10,
    },
});
