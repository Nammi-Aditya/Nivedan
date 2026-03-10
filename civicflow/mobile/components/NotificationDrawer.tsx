/**
 * NotificationDrawer
 * Slides in from the right. Shows all notifications with unread highlighting.
 * Tapping a notification navigates to the relevant complaint.
 */
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../constants/theme";
import { useNotifications, type AppNotification } from "../context/NotificationContext";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.88, 360);

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ visible, onClose }: Props) {
  const theme   = useTheme();
  const router  = useRouter();
  const { notifications, unreadCount, markRead, markAllRead, refreshNotifications } =
    useNotifications();
  const slideX = useRef(new Animated.Value(DRAWER_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      refreshNotifications();
      Animated.spring(slideX, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 220,
      }).start();
    } else {
      Animated.timing(slideX, {
        toValue: DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleTap = async (notif: AppNotification) => {
    if (!notif.read) await markRead(notif._id);
    onClose();
    if (notif.complaint_id) {
      // Navigate to dashboard case detail — we don't know subcategory here,
      // so navigate to My Cases which shows full details.
      setTimeout(() => router.push("/(tabs)/dashboard" as any), 200);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "filed":          return "📋";
      case "acknowledged":   return "👀";
      case "under_review":   return "🔍";
      case "next_step":      return "✅";
      case "resolved":       return "🎉";
      case "failed":         return "❌";
      default:               return "🔔";
    }
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <TouchableOpacity
        style={[s.backdrop]}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Drawer panel */}
      <Animated.View
        style={[
          s.drawer,
          { backgroundColor: theme.surface, transform: [{ translateX: slideX }] },
        ]}
      >
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          {/* Header */}
          <View style={[s.header, { borderBottomColor: theme.border }]}>
            <View>
              <Text style={[s.headerTitle, { color: theme.text }]}>Notifications</Text>
              {unreadCount > 0 && (
                <Text style={[s.headerSub, { color: theme.subtext }]}>
                  {unreadCount} unread
                </Text>
              )}
            </View>
            <View style={s.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={handleMarkAllRead} style={s.markAllBtn}>
                  <Text style={[s.markAllText, { color: theme.primary }]}>Mark all read</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[s.closeBtn, { color: theme.subtext }]}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* List */}
          {notifications.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyIcon}>🔕</Text>
              <Text style={[s.emptyText, { color: theme.subtext }]}>No notifications yet</Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(n) => n._id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleTap(item)}
                  style={[
                    s.item,
                    {
                      borderBottomColor: theme.border,
                      backgroundColor: item.read ? "transparent" : theme.primary + "0f",
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={s.itemIcon}>{typeIcon(item.type)}</Text>
                  <View style={s.itemBody}>
                    <Text
                      style={[
                        s.itemMessage,
                        { color: theme.text, fontWeight: item.read ? "400" : "600" },
                      ]}
                      numberOfLines={3}
                    >
                      {item.message}
                    </Text>
                    <Text style={[s.itemTime, { color: theme.subtext }]}>
                      {timeAgo(item.created_at)}
                    </Text>
                  </View>
                  {!item.read && (
                    <View style={[s.unreadDot, { backgroundColor: theme.primary }]} />
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

function timeAgo(isoString: string): string {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins  = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days  = Math.floor(diff / 86_400_000);
    if (mins < 1)   return "just now";
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } catch {
    return "";
  }
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle:   { fontSize: 17, fontWeight: "700" },
  headerSub:     { fontSize: 12, marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 16 },
  markAllBtn:    {},
  markAllText:   { fontSize: 12, fontWeight: "600" },
  closeBtn:      { fontSize: 18, fontWeight: "600" },

  empty:     { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 14 },

  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  itemIcon:    { fontSize: 22, marginTop: 1 },
  itemBody:    { flex: 1, gap: 4 },
  itemMessage: { fontSize: 13, lineHeight: 19 },
  itemTime:    { fontSize: 11 },
  unreadDot:   { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
});
