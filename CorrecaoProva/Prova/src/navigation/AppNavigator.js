import { createDrawerNavigator } from '@react-navigation/drawer';

import Questao04 from '../screens/Questao04';
import Questao05 from '../screens/Questao05';
import Questao08 from '../screens/Questao08';
import Questao10 from '../screens/Questao10';
import Questao12 from '../screens/Questao12';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Questão 04"
        component={Questao04}
      />

      <Drawer.Screen
        name="Questão 05"
        component={Questao05}
      />

      <Drawer.Screen
        name="Questão 08"
        component={Questao08}
      />

      <Drawer.Screen
        name="Questão 10"
        component={Questao10}
      />

      <Drawer.Screen
        name="Questão 12"
        component={Questao12}
      />
    </Drawer.Navigator>
  );
}