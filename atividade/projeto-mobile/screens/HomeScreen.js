import React from 'react';
import { View, Text } from 'react-native';
import homeStyles from '../styles/homeStyles';

export default function HomeScreen() {
  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.title}>Bem-vindo</Text>
      <Text style={homeStyles.message}>
        Utilize o menu de navegação para acessar as telas de modais e as listas com rolagem.
      </Text>
    </View>
  );
}
