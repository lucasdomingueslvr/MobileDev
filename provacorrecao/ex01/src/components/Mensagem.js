import React from 'react';
import { View, Text } from 'react-native';

export default function Mensagem({ texto }) {
    return (
        <View style={{ marginTop: 20 }}>
            <Text>{texto}</Text>
        </View>
    );
}