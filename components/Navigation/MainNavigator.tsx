import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../../screens/Splashscreen";
import SignUp from "../../screens/SignUp";
import BrokenScreen from "../../screens/BrokenScreen";

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUp} />
      <Stack.Screen name="BrokenScreen" component={BrokenScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
