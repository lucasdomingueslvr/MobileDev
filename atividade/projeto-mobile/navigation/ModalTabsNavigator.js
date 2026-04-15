import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ModalSlideScreen from '../screens/modals/ModalSlideScreen';
import ModalFadeScreen from '../screens/modals/ModalFadeScreen';
import ModalNoneScreen from '../screens/modals/ModalNoneScreen';

const Tab = createBottomTabNavigator();

export default function ModalTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2196F3' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
      }}
    >
      <Tab.Screen name="Slide" component={ModalSlideScreen} options={{ title: 'Modal Slide' }} />
      <Tab.Screen name="Fade" component={ModalFadeScreen} options={{ title: 'Modal Fade' }} />
      <Tab.Screen name="None" component={ModalNoneScreen} options={{ title: 'Modal None' }} />
    </Tab.Navigator>
  );
}
