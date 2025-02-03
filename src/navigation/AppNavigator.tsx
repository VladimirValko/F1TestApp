import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriversScreen from '../screens/DriversScreen';
import RacesScreen from '../screens/RacesScreen';
import DriverDetailsScreen from '../screens/DriverDetailsScreen';

export type RootStackParamList = {
  Drivers: undefined;
  DriverDetails: { driverId: string };
  Races: { driverId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Drivers">
        <Stack.Screen
          name="Drivers"
          component={DriversScreen}
          options={{ title: 'F1 Drivers' }}
        />
        <Stack.Screen
          name="DriverDetails"
          component={DriverDetailsScreen}
          options={{ title: 'Driver Details' }}
        />
        <Stack.Screen
          name="Races"
          component={RacesScreen}
          options={{ title: 'Race Results' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
