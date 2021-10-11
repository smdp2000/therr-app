import { Platform, StyleSheet } from 'react-native';
import beemoEditForm from './beemoEditForm';
import forgotPasswordForm from './forgotPasswordForm';
import verifyEmailForm from './verifyEmailForm';
import loginForm from './loginForm';
import phoneInput from './phoneInput';
import settingsForm from './settingsForm';
import * as therrTheme from '../themes';
import { containerStyles, inputStyle, textInputStyle } from './base';
import { HEADER_HEIGHT, HEADER_PADDING_BOTTOM } from '../';

const inputContainerBaseStyles = {
    borderBottomColor: therrTheme.colors.textDarkGray,
    borderBottomWidth: 1,
};

const platformSpecificInputStyles = Platform.OS !== 'ios' ? {
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.99,
    shadowRadius: 2,
} : {
    // backgroundColor: therrTheme.colors.backgroundWhite,
    backgroundColor: 'rgba(16,72,82,.7)', // colors.teriary with 70% opacity
    color: 'black',
};

export default StyleSheet.create({
    input: {
        ...inputStyle,
        color: therrTheme.colors.textWhite,
    },
    inputAlt: {
        ...inputStyle,
        // color: therrTheme.colors.textBlack,
        color: therrTheme.colors.textWhite,
    },
    inputBeemo: {
        ...inputStyle,
        backgroundColor: therrTheme.colors.beemo2,
        color: therrTheme.colors.beemoTextBlack,
        borderColor: therrTheme.colors.beemoTextBlack,
        borderWidth: 1,
    },
    headerSearchContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignSelf: 'center',
        flexDirection: 'column',
        height: HEADER_HEIGHT,
        marginBottom: Platform.OS === 'ios' ? HEADER_PADDING_BOTTOM / 2 : HEADER_PADDING_BOTTOM,
        // width: 500,
        left: 0,
        right: 0,
    },
    headerSearchInputContainer: {
        height: HEADER_HEIGHT - HEADER_PADDING_BOTTOM,
        margin: 0,
        padding: 0,
    },
    textField: {
        padding: inputStyle.padding,
        paddingTop: 0,
        paddingHorizontal: inputStyle.padding + 6,
    },
    textFieldInfoTextHeader: {
        fontWeight: 'bold',
        paddingBottom: 4,
        color: therrTheme.colors.textWhite,
    },
    textFieldInfoText: {
        color: therrTheme.colors.textWhite,
        letterSpacing: 0.5,
    },
    textInputBeemo: {
        ...textInputStyle,
        backgroundColor: therrTheme.colors.beemo2,
        color: therrTheme.colors.beemoTextBlack,
        borderColor: therrTheme.colors.beemoTextBlack,
        borderWidth: 1,
        borderRadius: 0,
        minHeight: 80,
    },
    phoneInput: {
        ...inputStyle,
        color: therrTheme.colors.textWhite,
        flex: 1,
        padding: 0,
        paddingBottom: 20,
        marginRight: 10,
    },
    inputContainerSquare: {
        ...inputContainerBaseStyles,
    },
    inputContainerRound: {
        ...inputContainerBaseStyles,
        ...platformSpecificInputStyles,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 25,
        elevation: 1,
        borderBottomWidth: 0,
    },
    inputLabelLight: {
        paddingHorizontal: 2,
        fontSize: 14,
        color: therrTheme.colors.beemoTextWhite,
    },
    inputLabelDark: {
        paddingHorizontal: 2,
        fontSize: 14,
        color: therrTheme.colors.beemoTextBlack,
    },
    inputSliderContainer: {
        ...containerStyles,
    },
    icon: {
        marginHorizontal: 5,
    },
    picker: {
        height: 50,
        width: '100%',
        color: therrTheme.colors.textWhite,
    },
    pickerItem: {
        height: 50,
        color: therrTheme.colors.textWhite,
    },
    phoneInputText: {
        ...inputContainerBaseStyles,
        color: therrTheme.colors.textWhite,
        fontSize: 19,
        padding: 10,
    },
    textInput: {
        ...textInputStyle,
        color: therrTheme.colors.textWhite,
    },
    textInputAlt: {
        ...textInputStyle,
        color: therrTheme.colors.textBlack,
    },
    button: {
        backgroundColor: therrTheme.colors.primary3,
    },
    buttonWarning: {
        backgroundColor: therrTheme.colors.ternary2,
    },
    buttonWarningTitle: {
        color: therrTheme.colors.primary3,
    },
    buttonDisabled: {
        backgroundColor: therrTheme.colorVariations.primary3Fade,
    },
    buttonTitleDisabled: {
        color: therrTheme.colors.textGray,
    },
    buttonIcon: {
        color: therrTheme.colors.textWhite,
        marginRight: 10,
        marginLeft: 10,
    },
    buttonPill: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        paddingHorizontal: 10,
        borderRadius: 20,
        height: 26,
        backgroundColor: therrTheme.colors.beemoTeal,
    },
    buttonPillIcon: {
        marginLeft: 8,
    },
    buttonPillContainer: {
        padding: 0,
        margin: 0,
        borderRadius: 20,
        height: 26,
        marginHorizontal: 4,
        marginTop: 14,
    },
    buttonPillTitle: {
        lineHeight: 26,
        paddingTop: 0,
        color: therrTheme.colors.beemoTextBlack,
    },
});

export {
    beemoEditForm,
    forgotPasswordForm,
    loginForm,
    phoneInput,
    settingsForm,
    verifyEmailForm,
};
