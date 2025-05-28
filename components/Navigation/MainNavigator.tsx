import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../../screens/Splashscreen";
import SignUpScreen from "../../screens/SignUpScreen";
import DashboardScreen from "../../screens/DashboardScreen";

export type RootStackParamList = {
  SplashScreen: undefined;
  SignUpScreen: undefined;
  Dashboard: {
    email: string;
    password: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
