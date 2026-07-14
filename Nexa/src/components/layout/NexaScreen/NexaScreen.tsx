import { ReactNode } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Colors,
  Spacing,
} from "../../../theme";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function NexaScreen({
  children,
  scroll = true,
  style,
}: Props) {

  if (scroll) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            style,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <SafeAreaView
        style={[
          styles.container,
          style,
        ]}
      >
        {children}
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safe: {

    flex: 1,

    backgroundColor: Colors.background,

  },

  container: {

    flexGrow: 1,

    padding: Spacing.md,

  },

});