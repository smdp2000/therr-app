import Color from 'color';
import { ITherrThemeColors, ITherrThemeColorVariations } from '../';

const colors: ITherrThemeColors = {
    // Main
    primary: '#1C7F8A',
    primary2: '#20919E',
    primary3: '#143b54',
    primary4: '#22A5B4',
    secondary: '#388254',
    secondaryFaded: '#4e8e67',
    ternary: '#e0c845',
    ternary2: '#ffc269',
    tertiary: '#104B52',

    // Text
    textBlack: '#363636',
    textGray: 'rgba(255,255,255,.58)',
    textDarkGray: '#728f94',
    textWhite: '#fcfeff',

    // Branding
    brandingMapYellow: '#ebc300',
    brandingOrange: '#f9ad2a',
    brandingLightBlue: '#d8f0f2',

    // Background
    backgroundCream: '#fefbf0',
    backgroundWhite: '#ffffff',
    backgroundGray: '#f3f4f6',
    backgroundNeutral: '#e7eaed',

    borderLight: 'gray',
    placeholderTextColor: '#78909b',

    hyperlink: '#0e01b3',

    // Alerts
    alertError: '#AC3E59',

    // Accents - Alternate color scheme to add variety and reduce blandless
    accent1: '#1E8A96',
    accent1Fade: '#97c5bb',
    accent2: '#cbffdc',
    accent3: '#218a35',
    accentAlt: '#449885',
    accentTextBlack: '#001226',
    accentTextWhite: '#fafafa',
    accentRed: '#fe0156',
    accentYellow: '#fed61e',
    accentBlue: '#17657D',
    accentPurple: '#0e01b3',
    accentTeal: '#2BC5D6',
    accentLime: '#00f729',
    accentDivider: '#4950571c',

    map: {
        momentsCircleFill: 'rgba(56,130,84,0.2)',
        momentsCircleFillActive: 'rgba(56,130,84,0.5)',
        spacesCircleFill: 'rgba(56,130,84,0.2)',
        spacesCircleFillActive: 'rgba(56,130,84,0.5)',
        myMomentsCircleFill: 'rgba(31,89,125,0.2)',
        myMomentsCircleFillActive: 'rgba(31,89,125,0.5)',
        mySpacesCircleFill: 'rgba(31,89,125,0.2)',
        mySpacesCircleFillActive: 'rgba(31,89,125,0.5)',
        userCircleFill: 'rgba(31,89,125,0.25)',
    },
};

const colorVariations: ITherrThemeColorVariations = {
    primaryFade: new Color(colors.primary).fade(0.35).toString(),
    primaryFadeMore: new Color(colors.primary).fade(0.65).toString(),
    primary2Fade: new Color(colors.primary2).fade(0.35).toString(),
    primary2Darken: new Color(colors.primary2).darken(0.075).toString(),
    primary3LightFade: new Color(colors.primary3).fade(0.15).toString(),
    primary3Fade: new Color(colors.primary3).fade(0.25).toString(),
    backgroundCreamLighten: new Color(colors.backgroundCream).lighten(0.02).toString(),
    textBlackFade: new Color(colors.textBlack).fade(0.75).toString(),
    textWhiteFade: new Color(colors.textWhite).fade(0.75).toString(),
    textGrayDarken: new Color(colors.textGray).darken(0.15).toString(),
    accent1Fade: new Color(colors.accent1).fade(0.2).toString(),
    accent1LightFade: new Color(colors.accent1).fade(0.2).toString(),
    accent1HeavyFade: new Color(colors.accent1).fade(0.7).toString(),
    accentBlueLightFade: new Color(colors.accentBlue).fade(0.2).toString(),
    accentBlueHeavyFade: new Color(colors.accentBlue).fade(0.7).toString(),
    accentTextBlack: new Color(colors.accentTextBlack).lighten(0.25).toString(),
    accentTextWhiteFade: new Color(colors.accentTextWhite).fade(0.1).toString(),

    // Background
    backgroundNeutral: new Color(colors.backgroundNeutral).darken(0.1).toString(),
    backgroundNeutralLighter: new Color(colors.backgroundNeutral).lighten(0.05).toString(),
};

export {
    colors,
    colorVariations,
};
