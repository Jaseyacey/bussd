import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../../screens/Splashscreen"; // Import SplashScreen

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
