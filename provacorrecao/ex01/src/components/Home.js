import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Mensagem from './Mensagem';

export default function Home() {
    const [texto, setTexto] = useState('');

    return (
        <View style={{ padding: 20 }}>
            <Text>PROVA DE MOBILE!</Text>

            <TextInput
                placeholder="Digite seu texto"
                value={texto}
                onChangeText={setTexto}
                style={{
                    borderWidth: 1,
                    marginTop: 10,
                    padding: 10
                }}
            />

            <Mensagem texto={texto} />
        </View>
    );
}