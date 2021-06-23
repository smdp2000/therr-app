import React, { useState } from 'react';
import { Button, Image } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import getConfig from '../../utilities/getConfig';
import ssoButtonStyles from '../../styles/buttons/ssoButtons';

const googleLogoImg = require('../../assets/google-letter-logo.png');

GoogleSignin.configure({
    webClientId: getConfig().googleOAuth2WebClientId,
});

interface IGoogleSignInButtonProps {
    buttonTitle: string;
    onLoginError: Function;
    onLoginSuccess: Function;
    disabled: boolean;
}

async function onGoogleButtonPress({
    onLoginError,
    onLoginSuccess,
    setDisabled,
}) {
    setDisabled(true);
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential)
        .then((userCredential) => {
            onLoginSuccess(idToken, userCredential.user, userCredential?.additionalUserInfo?.profile);
        })
        .catch((err) => {
            onLoginError(err);
        })
        .finally(() => {
            setDisabled(false);
        });
}

function GoogleSignInButton({
    buttonTitle,
    onLoginError,
    onLoginSuccess,
    disabled,
}: IGoogleSignInButtonProps) {
    const [isDisabled, setDisabled] = useState(false);

    return (
        <Button
            title={buttonTitle}
            onPress={() => onGoogleButtonPress({
                onLoginError,
                onLoginSuccess,
                setDisabled,
            })}
            disabled={disabled || isDisabled}
            raised={true}
            containerStyle={ssoButtonStyles.googleButtonContainer}
            buttonStyle={ssoButtonStyles.googleButton}
            titleStyle={ssoButtonStyles.googleButtonTitle}
            icon={
                <Image
                    source={googleLogoImg}
                    style={ssoButtonStyles.googleButtonIcon}
                />}
        />
    );
}

export default GoogleSignInButton;