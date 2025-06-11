import { View, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "components/Navigation/MainNavigator";

const BottomTab = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.tabButton}
        onPress={() =>
          navigation.navigate("Dashboard", { email: "", user_uuid: "" })
        }
      >
        <Icon name="home" size={24} color="#000000" />
      </Pressable>
      <Pressable
        style={styles.tabButton}
        onPress={() => navigation.navigate("AddBusRoute")}
      >
        <Icon name="search" size={24} color="#000000" />
      </Pressable>
      <Pressable
        style={styles.tabButton}
        onPress={() => navigation.navigate("UserProfile")}
      >
        <Icon name="user" size={24} color="#000000" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 60,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 44,
    borderRadius: 22,
  },
});

export default BottomTab;
