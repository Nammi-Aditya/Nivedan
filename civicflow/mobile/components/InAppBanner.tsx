/**
 * InAppBanner
 * Slides down from the top of the screen for 4 seconds, then auto-dismisses.
 * Shown when a push notification arrives while the app is foregrounded.
 */
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../constants/theme";

export interface BannerData {
  title: string;
  body: string;
  onPress?: () => void;
}

interface Props {
  banner: BannerData | null;
  onDismiss: () => void;
}

export default function InAppBanner({ banner, onDismiss }: Props) {
  const theme   = useTheme();
  const insets  = useSafeAreaInsets();
  const slideY  = useRef(new Animated.Value(-120)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!banner) return;

    // Slide in
    Animated.spring(slideY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 18,
      stiffness: 200,
    }).start();

    // Auto-dismiss after 4s
    timerRef.current = setTimeout(dismiss, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [banner]);

  const dismiss = () => {
    Animated.timing(slideY, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onDismiss());
  };

  if (!banner) return null;

  return (
    <Animated.View
      style={[
        s.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          top: insets.top + (Platform.OS === "android" ? 8 : 4),
          transform: [{ translateY: slideY }],
        },
      ]}
    >
      <TouchableOpacity
        style={s.inner}
        activeOpacity={0.85}
        onPress={() => {
          dismiss();
          banner.onPress?.();
        }}
      >
        <Text style={s.bellIcon}>🔔</Text>
        <Animated.View style={s.textCol}>
          <Text style={[s.title, { color: theme.text }]} numberOfLines={1}>
            {banner.title}
          </Text>
          <Text style={[s.body, { color: theme.subtext }]} numberOfLines={2}>
            {banner.body}
          </Text>
        </Animated.View>
        <TouchableOpacity onPress={dismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[s.close, { color: theme.subtext }]}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    right: 12,
    zIndex: 9999,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  bellIcon: { fontSize: 22 },
  textCol:  { flex: 1 },
  title:    { fontSize: 13, fontWeight: "700" },
  body:     { fontSize: 12, marginTop: 2, lineHeight: 17 },
  close:    { fontSize: 16, fontWeight: "600", paddingLeft: 4 },
});
