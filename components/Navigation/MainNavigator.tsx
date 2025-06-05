import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../../screens/Splashscreen";
import DashboardScreen from "../../screens/DashboardScreen";
import Auth from "../../src/lib/components/Auth";

export type RootStackParamList = {
  SplashScreen: undefined;
  Auth: undefined;
  Dashboard: {
    email: string;
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
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
