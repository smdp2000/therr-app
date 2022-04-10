import React, { useState } from 'react';
import { Text, Modal, Pressable, View } from 'react-native';
import { Button } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AnimatedLottieView from 'lottie-react-native';

import claimASpace from '../../assets/claim-a-space.json';
import shareAMoment from '../../assets/share-a-moment.json';
import discover from '../../assets/discover.json';

interface ITouringModal {
    isVisible: boolean;
    onRequestClose: any;
    translate: Function;
    themeButtons: {
        styles: any;
    };
    themeTour: {
        styles: any;
    };
}

const ModalButton = ({ title, iconName, onPress, iconRight, themeButtons }) => {
    const iconStyle = iconRight ? { paddingLeft: 7 } : { paddingRight: 7 };
    return (
        <Button
            containerStyle={{ flex: 1 }}
            buttonStyle={[themeButtons.styles.btnClear, { padding: 10 }]}
            titleStyle={themeButtons.styles.btnTitleBlack}
            icon={
                <MaterialIcon
                    name={iconName}
                    size={20}
                    style={[themeButtons.styles.btnIconBlack, iconStyle]}
                />
            }
            iconRight={iconRight}
            raised={true}
            type="clear"
            onPress={onPress}
            title={title}
        />
    );
};

export default ({
    isVisible,
    onRequestClose,
    themeButtons,
    themeTour,
    translate,
}: ITouringModal) => {
    const [tab, setTab] = useState(0);
    const onClose = () => {
        setTab(0);
        onRequestClose();
    };

    return (
        <Modal
            animationType="fade"
            visible={isVisible}
            onRequestClose={onClose}
            transparent={true}
            style={{
                zIndex: 1000,
            }}
        >
            <Pressable
                onPress={onClose}
                style={themeTour.styles.overlay}>
                {
                    (tab !== 1 && tab !== 2) &&
                    <Pressable style={themeTour.styles.container}>
                        <Text style={themeTour.styles.header}>{translate('modals.touringModal.header1')}</Text>
                        <Text style={themeTour.styles.text}>{translate('modals.touringModal.claimYourSpaces')}</Text>
                        <AnimatedLottieView
                            source={claimASpace}
                            // resizeMode="cover"
                            speed={1}
                            autoPlay={false}
                            loop
                            style={themeTour.styles.graphic}
                        />
                        <View style={themeTour.styles.actionsContainer}>
                            <ModalButton
                                iconName="close"
                                title={translate('modals.touringModal.exit')}
                                onPress={onClose}
                                iconRight={false}
                                themeButtons={themeButtons}
                            />
                            <ModalButton
                                iconName="arrow-forward"
                                title={translate('modals.touringModal.next')}
                                onPress={() => setTab(1)}
                                iconRight
                                themeButtons={themeButtons}
                            />
                        </View>
                    </Pressable>
                }
                {
                    (tab === 1) &&
                    <Pressable style={themeTour.styles.container}>
                        <Text style={themeTour.styles.header}>{translate('modals.touringModal.header2')}</Text>
                        <Text style={themeTour.styles.text}>{translate('modals.touringModal.createAMoment')}</Text>
                        <AnimatedLottieView
                            source={shareAMoment}
                            // resizeMode="cover"
                            speed={1}
                            autoPlay={false}
                            loop
                            style={themeTour.styles.graphic}
                        />
                        <View style={themeTour.styles.actionsContainer}>
                            <ModalButton
                                iconName="arrow-back"
                                title={translate('modals.touringModal.back')}
                                onPress={() => setTab(0)}
                                iconRight={false}
                                themeButtons={themeButtons}
                            />
                            <ModalButton
                                iconName="arrow-forward"
                                title={translate('modals.touringModal.next')}
                                onPress={() => setTab(2)}
                                iconRight
                                themeButtons={themeButtons}
                            />
                        </View>
                    </Pressable>
                }
                {
                    (tab === 2) &&
                    <Pressable style={themeTour.styles.container}>
                        <Text style={themeTour.styles.header}>{translate('modals.touringModal.header3')}</Text>
                        <Text style={themeTour.styles.text}>{translate('modals.touringModal.exploreTheWorld')}</Text>
                        <AnimatedLottieView
                            source={discover}
                            // resizeMode="cover"
                            speed={1}
                            autoPlay={false}
                            loop
                            style={themeTour.styles.graphic}
                        />
                        <View style={themeTour.styles.actionsContainer}>
                            <ModalButton
                                iconName="arrow-back"
                                title={translate('modals.touringModal.back')}
                                onPress={() => setTab(1)}
                                iconRight={false}
                                themeButtons={themeButtons}
                            />
                            <ModalButton
                                iconName="check"
                                title={translate('modals.touringModal.done')}
                                onPress={onClose}
                                iconRight
                                themeButtons={themeButtons}
                            />
                        </View>
                    </Pressable>
                }
            </Pressable>
        </Modal>
    );
};
