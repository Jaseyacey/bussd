import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const BottomTab = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Icon name="home" size={24} color="black" />
      </View>
      <View style={styles.icon}>
        <Icon
          name="search"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("AddBusRoute" as never);
          }}
        />
      </View>
      <View style={styles.icon}>
        <Icon name="user" size={24} color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "red",
    width: "100%",
    height: 50,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
});

export default BottomTab;
