import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ModalTabsNavigator from './ModalTabsNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerModalNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Modals" component={ModalTabsNavigator} />
    </Drawer.Navigator>
  );
}
