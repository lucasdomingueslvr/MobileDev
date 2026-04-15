import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ScrollTabsNavigator from './ScrollTabsNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerScrollNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Scrolls" component={ScrollTabsNavigator} />
    </Drawer.Navigator>
  );
}

