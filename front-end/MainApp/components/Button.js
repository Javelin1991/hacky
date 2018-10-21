import React from 'react';
import {
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Platform
} from 'react-native';

const Button = (props) => {
    return (
        <TouchableWithoutFeedback {...props}>
            {props.children}
        </TouchableWithoutFeedback>
    );
};

module.exports = Button;
