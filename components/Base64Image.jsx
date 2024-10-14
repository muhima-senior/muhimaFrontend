import React from 'react';
import { Image, Text, View } from 'react-native';

const Base64Image = ({ base64String, style }) => {
    // Check if base64String exists and is a valid string

    if (!base64String || typeof base64String !== 'string') {
        return (
            <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
                <Text>No image available</Text>
            </View>
        );
    }

    const uri = base64String.startsWith('data:image')
        ? base64String
        : `data:image/jpeg;base64,${base64String}`;
    return (
        <Image
            source={{ uri }}
            style={style}
        />
    );
}

export default Base64Image;
