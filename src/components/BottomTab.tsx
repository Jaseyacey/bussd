import { Icon } from "@rneui/base";
import { View, StyleSheet } from "react-native";

const BottomTab = () => {
  return (
    <View style={styles.container}>
      <Icon
        name="home"
        size={24}
        color="black"
        type="material"
        containerStyle={styles.icon}
      />
      <Icon
        name="search"
        size={24}
        color="black"
        type="material"
        containerStyle={styles.icon}
      />
      <Icon
        name="user"
        size={24}
        color="black"
        type="material"
        containerStyle={styles.icon}
      />
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
