import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text } from 'react-native';

const Drawer = createDrawerNavigator();

function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Home Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Profile Screen</Text>
    </View>
  );
}

export default function Questao08() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Drawer.Navigator>
  );
}