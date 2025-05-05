import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "@/components/ToastProvider";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Support = () => {
  const [message, setMessage] = useState("");
  const { showToast } = useToast();

  const handleSendMessage = () => {
    if (message.trim() === "") {
      showToast("Please enter your message", "error");
      return;
    }

    const email = "AurathreadsSupport@gmail.com";
    const subject = "Help & Support";
    const body = message;

    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
      .then(() => {
        setMessage("");
        showToast("Email app opened", "success");
      })
      .catch(() => {
        showToast("Could not open email client", "error");
      });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <StatusBar style="dark" />
        
        {/* Custom Header with safe area padding */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24}  />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help & Support</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Contact our team</Text>
              <Text style={styles.cardSubtitle}>
                Send us a message and we'll get back to you as soon as possible
              </Text>

              <TextInput
                style={styles.input}
                multiline
                placeholder="Describe your issue or question..."
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSendMessage}
              >
                <Ionicons name="mail" size={18} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Send via Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingTop: 40, 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    textAlign: "center",
    flex: 1,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eaeaea",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  cardTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    height: 160,
    fontFamily: "Poppins-Regular",
    color: "#18392b",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#588b76",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    color: "#fff",
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default Support;