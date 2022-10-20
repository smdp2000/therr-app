import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function MarkerIconFood(props) {
    return (
        <Svg width={30} height={30} enableBackground="new 0 0 24 24"  viewBox="0 0 24 24" {...props}>
            <Path
                d="M0 0h24v24H0V0z" fill="none"
            />
            <Path
                d="M16 6v8h3v8h2V2c-2.76 0-5 2.24-5 4zm-5 3H9V2H7v7H5V2H3v7c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7z"
            />
        </Svg>
    );
}
