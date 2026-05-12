// App.js

import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'

import PessoaListScreen from './src/screens/PessoaListScreen'
import PessoaFormScreen from './src/screens/PessoaFormScreen'
import PessoaDetailScreen from './src/screens/PessoaDetailScreen'

import ProdutoListScreen from './src/screens/ProdutoListScreen'
import ProdutoFormScreen from './src/screens/ProdutoFormScreen'
import ProdutoDetailScreen from './src/screens/ProdutoDetailScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="ProdutoList"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
              color: '#0f172a',
            },
            headerTintColor: '#2563eb',
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: '#f8fafc',
            },
          }}
        >
          <Stack.Screen
            name="PessoaList"
            component={PessoaListScreen}
            options={{ title: 'Lista de Pessoas' }}
          />
          <Stack.Screen
            name="PessoaDetail"
            component={PessoaDetailScreen}
            options={{ title: 'Detalhes' }}
          />
          <Stack.Screen
            name="PessoaForm"
            component={PessoaFormScreen}
            options={({ route }) => ({
              title: route.params?.id ? 'Editar Pessoa' : 'Nova Pessoa',
            })}
          />
          <Stack.Screen
            name="ProdutoList"
            component={ProdutoListScreen}
            options={{ title: 'Lista de Produtos' }}
          />
          <Stack.Screen
            name="ProdutoDetail"
            component={ProdutoDetailScreen}
            options={{ title: 'Detalhes' }}
          />
          <Stack.Screen
            name="ProdutoForm"
            component={ProdutoFormScreen}
            options={({ route }) => ({
              title: route.params?.id ? 'Editar Produto' : 'Novo Produto',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    
  )
}