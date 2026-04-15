import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';


import HomeScreen from '../screens/HomeScreen';
import DrawerModalNavigator from '../navigation/DrawerModalNavigator';
import DrawerScrollNavigator from '../navigation/DrawerScrollNavigator';


import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import FormScreen from './FormScreen';
import ListScreen from './ListScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MainDrawer() {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      // O estado user será atualizado e o NavigationContainer trocará para AuthStack
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const LogoutHeaderButton = () => (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sair</Text>
    </TouchableOpacity>
  );

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2196F3' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        drawerActiveTintColor: '#2196F3',
        drawerInactiveTintColor: '#888',
        drawerLabelStyle: { fontSize: 16, fontWeight: 'bold' },
        headerRight: () => <LogoutHeaderButton />,
      }}
    >
      <Drawer.Screen name="Início" component={HomeScreen} />
      <Drawer.Screen name="Modais" component={DrawerModalNavigator} />
      <Drawer.Screen name="Lista de Rolagem" component={DrawerScrollNavigator} />
      <Drawer.Screen name="Registrar Aluguel" component={FormScreen} />
      <Drawer.Screen name="Lista de Aluguéis" component={ListScreen} />
    </Drawer.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2196F3" />
    </View>
  );
}

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}