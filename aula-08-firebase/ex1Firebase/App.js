import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UserListScreen from './src/screens/UserListScreen';
import EditUserScreen from './src/screens/EditUserScreen';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Bem-vindo" component={WelcomeScreen} />
      <Drawer.Screen name="Lista de Usuários" component={UserListScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={MyDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="EditUser" component={EditUserScreen} options={{ title: 'Editar Usuário' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}