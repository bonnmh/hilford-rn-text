import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

interface LoopTextProps {
    textArray: string[];
    style: ReactNode;
    delay: number;
    duration: number;
}

const getAnimationValue = (delay, duration, callBack) => {
    let isMounted = true
    const animationValue = useRef(new Animated.Value(0)).current;
    const fadeInOut = () => {
        Animated.sequence([
            Animated.timing(animationValue, {
                delay: 200,
                duration: duration,
                toValue: 0.5,
                useNativeDriver: true,
            }),
            Animated.timing(animationValue, {
                delay: delay,
                duration: duration,
                toValue: 1,
                useNativeDriver: true,
            }),

        ]).start(() => {
            if (isMounted) {
                animationValue.setValue(0);
                callBack()
                fadeInOut();
            }
        });
    };
    useEffect(() => {
        fadeInOut();

        return () => {
            animationValue.stopAnimation()
            isMounted = false
        }
    }, []);
    return (animationValue);
};

const LoopText = ({ textArray, style, delay, duration }: LoopTextProps) => {
    const [count, setCount] = useState(0);
    const animationValue = getAnimationValue(delay, duration, () => {
        setCount((prevCount) =>
            prevCount + 1 < textArray.length ?
                prevCount + 1 : 0);
    });
    return (
        <Animated.Text style={[
            style,
            {
                opacity: animationValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1, 0],
                }),
                transform: [
                    {
                        translateY: animationValue.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [-20, 0, 20],
                        }),
                    },
                ],
            },
        ]}
        >
            {textArray[count]}
        </Animated.Text>
    );
};

LoopText.defaultProps = {
    delay: 4000,
    duration: 1000,
    style: {
        color: 'black',
        fontSize: 25,
        textAlign: 'center',
        marginTop: 20,
    }
};

LoopText.propTypes = {
    textArray: PropTypes.array.isRequired,
    style: PropTypes.any,
    delay: PropTypes.number,
    duration: PropTypes.number,
};
export default LoopText;