import { StyleSheet } from 'react-native';
import * as therrTheme from '../themes';

export default StyleSheet.create({
    addMoment: {
        position: 'absolute',
        right: 18,
        bottom: 38,
        shadowColor: therrTheme.colors.textBlack,
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowRadius: 4,
        borderRadius: 100,
        padding: 0,
    },
    refreshMoments: {
        position: 'absolute',
        right: 18,
        bottom: 110,
        shadowColor: therrTheme.colors.textBlack,
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowRadius: 4,
        borderRadius: 100,
        padding: 0,
    },
    momentBtn: {
        backgroundColor: therrTheme.colors.beemo1,
        borderRadius: 100,
        padding: 0,
        borderWidth: 0,
    },
    momentBtnIcon: {
        color: therrTheme.colors.ternary,
        padding: 0,
    },
    mapView: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    editMomentOverlay: {
        backgroundColor: therrTheme.colors.beemo1,
        display: 'flex',
        height: '100%',
        width: '100%',
        alignSelf: 'flex-end',
        flexDirection: 'column',
        borderRadius: 0,
        padding: 0,
        zIndex: 10000,
        position: 'absolute',
        top: 0,
        left: 0,
    },
});
