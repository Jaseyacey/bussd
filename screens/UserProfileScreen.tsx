import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RootStackParamList } from "../components/Navigation/MainNavigator";
import { StackScreenProps } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

type UserProfileScreenProps = StackScreenProps<
  RootStackParamList,
  "UserProfile"
>;

const UserProfileScreen = ({ navigation }: UserProfileScreenProps) => {
  const menuSections = [
    {
      title: "Account",
      items: [
        { id: "profile", label: "User Profile", icon: "person-outline" },
        {
          id: "deleteAccount",
          label: "Delete Account",
          icon: "trash-outline",
          danger: true,
        },
        {
          id: "logout",
          label: "Logout",
          icon: "log-out-outline",
          danger: true,
        },
      ],
    },
    {
      title: "Information",
      items: [
        {
          id: "privacyPolicy",
          label: "Privacy Policy",
          icon: "shield-outline",
        },
        {
          id: "termsOfService",
          label: "Terms of Service",
          icon: "document-text-outline",
        },
        { id: "contactUs", label: "Contact Us", icon: "mail-outline" },
        {
          id: "aboutUs",
          label: "About Us",
          icon: "information-circle-outline",
        },
      ],
    },
    {
      title: "Support",
      items: [
        { id: "feedback", label: "Feedback", icon: "chatbubble-outline" },
        { id: "help", label: "Help", icon: "help-circle-outline" },
        { id: "share", label: "Share", icon: "share-outline" },
      ],
    },
  ];

  const handlePress = (id: string) => {
    switch (id) {
      case "logout":
        navigation.navigate("SignInScreen");
        break;
      case "deleteAccount":
        navigation.navigate("DeleteAccount");
        break;
      case "privacyPolicy":
        navigation.navigate("PrivacyPolicy");
        break;
      case "termsOfService":
        navigation.navigate("TermsOfService");
        break;
      case "contactUs":
        navigation.navigate("ContactUs");
        break;
      case "aboutUs":
        navigation.navigate("AboutUs");
        break;
      case "feedback":
        navigation.navigate("Feedback");
        break;
      case "help":
        navigation.navigate("Help");
        break;
      case "share":
        navigation.navigate("Share");
        break;
    }
    console.log(`Pressed ${id}`);
  };

  const MenuItem = ({
    item,
  }: {
    item: { id: string; label: string; icon: string; danger?: boolean };
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handlePress(item.id)}
    >
      <View style={styles.menuItemContent}>
        <Ionicons
          name={item.icon as any}
          size={24}
          color={item.danger ? styles.dangerText.color : styles.text.color}
        />
        <Text style={[styles.menuItemText, item.danger && styles.dangerText]}>
          {item.label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {menuSections.map((section, index) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: "#666666",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
    paddingHorizontal: 16,
    textTransform: "uppercase",
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#000000",
  },
  text: {
    color: "#000000",
  },
  dangerText: {
    color: "#FF3B30",
  },
});

export default UserProfileScreen;
