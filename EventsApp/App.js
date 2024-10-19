import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './modules/DrawerNavigator';
import Login from './page/Login';
import Event from './page/Event';
import Support from './page/Support';
import Inscription from './page/Inscription';
import Exhibitors from './page/Exhibitors';
import Encuesta from './modules/Encuesta';
import Form from './page/Form';
import SplashScreen from './SplashScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
        <Stack.Screen name="Event" component={Event} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="Inscription" component={Inscription} />
        <Stack.Screen name="Exhibitors" component={Exhibitors} />
        <Stack.Screen name="Form" component={Form} />
        <Stack.Screen name="Encuesta" component={Encuesta} options={{ title: 'Encuesta' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
