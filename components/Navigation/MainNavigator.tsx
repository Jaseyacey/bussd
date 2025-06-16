import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../../screens/Splashscreen";
import DashboardScreen from "../../screens/DashboardScreen";
import SignInScreen from "../../screens/SignInScreen.tsx";
import AddBusRoute from "../../screens/AddBusRoute";
import EditBusRoute from "../../screens/EditBusRoute";
import Auth from "../../src/lib/components/Auth";
import UserProfileScreen from "../../screens/UserProfileScreen.tsx";
import PercentageOfAllBusRoutes from "../../screens/PercentageOfAllBusRoutes";

export type RootStackParamList = {
  SplashScreen: undefined;
  Auth: undefined;
  Dashboard: {
    email: string;
    user_uuid: string;
  };
  SignInScreen: undefined;
  AddBusRoute: undefined;
  SignUpScreen: undefined;
  EditBusRoute: {
    bus_route: string;
    percentage_travelled: number;
    routeId: number;
    userUuid: string;
  };
  UserProfile: undefined;
  DeleteAccount: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  ContactUs: undefined;
  AboutUs: undefined;
  Feedback: undefined;
  Help: undefined;
  PercentageOfAllBusRoutes: undefined;
  Share: undefined;
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
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="AddBusRoute" component={AddBusRoute} />
      <Stack.Screen name="EditBusRoute" component={EditBusRoute} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen
        name="PercentageOfAllBusRoutes"
        component={PercentageOfAllBusRoutes}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
