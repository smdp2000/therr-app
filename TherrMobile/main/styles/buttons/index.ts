import { StyleSheet } from 'react-native';
import { buttonMenuHeightCompact } from '../navigation/buttonMenu';
import * as therrTheme from '../themes';

const btnStyles: any = {
    borderRadius: 100,
    padding: 0,
    borderWidth: 0,
};

const collapseOffset = 20;

export default StyleSheet.create({
    addMoment: {
        position: 'absolute',
        right: 18,
        bottom: 44 + buttonMenuHeightCompact - collapseOffset,
        shadowColor: therrTheme.colors.textBlack,
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowRadius: 4,
        borderRadius: 100,
        padding: 0,
    },
    // collapse: {
    //     position: 'absolute',
    //     right: 18,
    //     bottom: collapseOffset + buttonMenuHeightCompact,
    //     shadowColor: therrTheme.colors.textBlack,
    //     shadowOffset: {
    //         height: 1,
    //         width: 1,
    //     },
    //     shadowRadius: 4,
    //     borderRadius: 100,
    //     padding: 0,
    //     width: 96,
    //     height: 20,
    // },
    compass: {
        position: 'absolute',
        right: 84,
        bottom: 44 + buttonMenuHeightCompact - collapseOffset,
        shadowColor: therrTheme.colors.textBlack,
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowRadius: 4,
        borderRadius: 100,
        padding: 0,
    },
    toggleFollow: {
        position: 'absolute',
        left: 18,
        bottom: 110 + buttonMenuHeightCompact - collapseOffset,
        shadowColor: therrTheme.colors.textBlack,
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowRadius: 4,
        borderRadius: 100,
        padding: 0,
    },
    recenter: {
        position: 'absolute',
        right: 18,
        bottom: 110 + buttonMenuHeightCompact - collapseOffset,
        shadowColor: therrTheme.colors.textBlack,
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowRadius: 4,
        borderRadius: 100,
        padding: 0,
    },
    momentLayers: {
        position: 'absolute',
        left: 90,
        bottom: 44 + buttonMenuHeightCompact - collapseOffset,
        shadowColor: therrTheme.colors.textBlack,
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowRadius: 4,
        borderRadius: 100,
        padding: 0,
    },
    momentLayerOption1: {
        position: 'absolute',
        left: 96,
        bottom: 100 + buttonMenuHeightCompact - collapseOffset,
        shadowColor: therrTheme.colors.textBlack,
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowRadius: 4,
        borderRadius: 100,
        padding: 0,
        height: 32,
        width: 32,
    },
    momentLayerOption2: {
        position: 'absolute',
        left: 96,
        bottom: 144 + buttonMenuHeightCompact - collapseOffset,
        shadowColor: therrTheme.colors.textBlack,
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowRadius: 4,
        borderRadius: 100,
        padding: 0,
        height: 32,
        width: 32,
    },
    refreshMoments: {
        position: 'absolute',
        left: 18,
        bottom: 44 + buttonMenuHeightCompact - collapseOffset,
        shadowColor: therrTheme.colors.textBlack,
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowRadius: 4,
        borderRadius: 100,
        padding: 0,
    },
    btn: {
        ...btnStyles,
        backgroundColor: therrTheme.colors.beemo1,
    },
    btnClear: {
        ...btnStyles,
        backgroundColor: 'transparent',
    },
    btnIcon: {
        color: therrTheme.colors.ternary,
        padding: 0,
    },
    btnIconInactive: {
        color: therrTheme.colors.primary3,
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
    momentAlertOverlayContainer: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        padding: 0,
        zIndex: 10000,
    },
});
