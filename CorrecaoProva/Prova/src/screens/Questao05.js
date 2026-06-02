import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
} from 'react-native';

export default function Questao05() {
  const [texto, setTexto] = useState('');

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Digite seu texto"
        value={texto}
        onChangeText={setTexto}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
        }}
      />

      <Text>{texto}</Text>
    </View>
  );
}