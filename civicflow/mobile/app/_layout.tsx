import React, { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { NotificationProvider, useNotifications, type AppNotification } from "../context/NotificationContext";
import {
  registerForPushNotifications,
  addForegroundListener,
  addResponseListener,
  type ForegroundNotification,
} from "../services/notifications";
import InAppBanner, { type BannerData } from "../components/InAppBanner";

// ── Auth guard + push setup ───────────────────────────────────────────────────

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const { notifications, refreshNotifications } = useNotifications();
  const segments = useSegments();
  const router   = useRouter();

  const [banner, setBanner] = useState<BannerData | null>(null);
  // Track which notification IDs we've already bannered so we don't re-show them
  const seenIdsRef = useRef<Set<string>>(new Set());
  // Skip showing banners on the very first load (existing notifications)
  const initialLoadDoneRef = useRef(false);

  // Register for push notifications (no-op in Expo Go, works in dev builds)
  useEffect(() => {
    if (user) registerForPushNotifications();
  }, [user]);

  // Push foreground listener — works in dev builds
  useEffect(() => {
    if (!user) return;
    const removeFg = addForegroundListener((notif: ForegroundNotification) => {
      refreshNotifications();
      setBanner({
        title: notif.title,
        body: notif.body,
        onPress: () => router.push("/(tabs)/dashboard" as any),
      });
    });
    return removeFg;
  }, [user, refreshNotifications]);

  // Background/killed notification tap
  useEffect(() => {
    if (!user) return;
    const removeResp = addResponseListener((data) => {
      if (data.type === "status_update") router.push("/(tabs)/dashboard" as any);
    });
    return removeResp;
  }, [user]);

  // Polling-based banner — fires in Expo Go where push isn't available.
  // Every time `notifications` updates, check for IDs we haven't seen yet.
  useEffect(() => {
    if (!user || notifications.length === 0) return;

    const unread = notifications.filter((n: AppNotification) => !n.read);

    if (!initialLoadDoneRef.current) {
      // First load — seed seen IDs so we don't banner existing notifications
      unread.forEach((n) => seenIdsRef.current.add(n._id));
      initialLoadDoneRef.current = true;
      return;
    }

    // Find any unread notification we haven't bannered yet
    const newest = unread.find((n) => !seenIdsRef.current.has(n._id));
    if (newest) {
      seenIdsRef.current.add(newest._id);
      setBanner({
        title: "CivicFlow Update",
        body: newest.message,
        onPress: () => router.push("/(tabs)/dashboard" as any),
      });
    }
  }, [notifications, user]);

  // Auth guard
  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "auth";
    if (!user && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0d0d0d" }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <InAppBanner banner={banner} onDismiss={() => setBanner(null)} />
    </View>
  );
}

// ── Root layout ───────────────────────────────────────────────────────────────

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotificationProvider>
          <RootLayoutNav />
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
