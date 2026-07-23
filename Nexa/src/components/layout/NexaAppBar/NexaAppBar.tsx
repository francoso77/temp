import { router } from "expo-router";
import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
  Colors,
  Radius,
  Shadows,
  Spacing,
} from "@/theme";

import { NexaIcon, NexaText } from "@/components";

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightComponent?: ReactNode;
  children?: ReactNode;
};

export function NexaAppBar({

  title,
  subtitle,
  showBack = true,
  onBack,
  rightComponent,
  children,
}: Props) {

  function handleBack() {

    if (onBack) {
      onBack();
      return;
    }

    router.back();
  }

  return (

    <View style={styles.container}>

      <View style={styles.left}>

        {showBack && (

          <Pressable
            hitSlop={16}
            onPress={handleBack}
          >

            <NexaIcon
              name="chevron-back"
              size={26}
            />

          </Pressable>
        )}

        <View>

          <NexaText
            variant="h1"
            weight="700"
          >
            {title}
          </NexaText>

          {!!subtitle && (

            <NexaText
              variant="small"
              color={Colors.textSecondary}
            >
              {subtitle}
            </NexaText>

          )}

        </View>

      </View>

      {rightComponent}
      {children}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  left: {

    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
});