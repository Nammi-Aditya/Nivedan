/**
 * ThinkingStrip — AI "thinking" panel.
 * Design: Nivedan / Sovereign Ledger — navy + saffron palette.
 */
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../constants/theme";

interface Props {
  visible: boolean;
  steps?: string[];
  onDone?: () => void;
}

const LOADING_LABELS = [
  "Thinking…",
  "Processing…",
  "Reasoning…",
  "Analysing…",
];

export default function ThinkingStrip({ visible, steps, onDone }: Props) {
  const theme = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;

  const [loadingIndex,  setLoadingIndex]  = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [phase,         setPhase]         = useState<"loading" | "reveal" | "hidden">("hidden");

  useEffect(() => {
    if (visible) {
      setPhase("loading");
      setRevealedCount(0);
      setLoadingIndex(0);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible && steps && steps.length > 0) {
      setRevealedCount(0);
      setPhase("reveal");
    }
  }, [steps, visible]);

  useEffect(() => {
    if (phase !== "loading") return;
    const t = setInterval(() => setLoadingIndex((i) => (i + 1) % LOADING_LABELS.length), 900);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "hidden") return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 500, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [phase, pulse]);

  useEffect(() => {
    if (phase !== "reveal" || !steps || steps.length === 0) return;
    if (revealedCount < steps.length) {
      const t = setTimeout(() => setRevealedCount((c) => c + 1), 350);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setPhase("hidden");
        onDone?.();
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [phase, revealedCount, steps, onDone]);

  if (phase === "hidden") return null;

  return (
    <View style={[s.container, { backgroundColor: theme.surface, borderTopColor: theme.surfaceContainerHigh }]}>
      <View style={s.headerRow}>
        <Animated.View style={[s.dot, { opacity: pulse, backgroundColor: theme.secondary }]} />
        <Text style={[s.headerText, { color: theme.secondary }]}>
          {phase === "loading" ? LOADING_LABELS[loadingIndex] : "Agent worked through"}
        </Text>
      </View>

      {phase === "reveal" && steps && steps.slice(0, revealedCount).map((step, i) => (
        <StepLine key={i} text={step} theme={theme} />
      ))}
    </View>
  );
}

function StepLine({
  text,
  theme,
}: {
  text: string;
  theme: ReturnType<typeof useTheme>;
}) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[s.stepRow, { opacity, transform: [{ translateX }] }]}>
      <Ionicons name="checkmark-circle" size={12} color={theme.tertiary} />
      <Text style={[s.stepText, { color: theme.subtext }]} numberOfLines={1}>
        {text}
      </Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 12,
    borderTopWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
    shadowColor: "#1B2A4A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 2,
  },
  dot:        { width: 7, height: 7, borderRadius: 4 },
  headerText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 1,
  },
  stepText: { fontSize: 12, flex: 1 },
});
