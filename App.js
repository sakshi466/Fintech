import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import MutualFundDashboard from './MutualFundDashboard';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MutualFundDashboard" component={MutualFundDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;