import { ReactNode } from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import {
  Colors,
  Spacing,
} from "@/theme";

import {
  NexaButton,
  NexaCard,
  NexaSpacer,
  NexaText,
} from "@/components";

type Action = {

  title: string;

  variant?:
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";

  onPress: () => void;

};

type Props = {

  title: string;

  subtitle?: string;

  footer?: ReactNode;

  children?: ReactNode;

  actions?: Action[];

};

export function NexaActionCard({

  title,

  subtitle,

  footer,

  children,

  actions = [],

}: Props) {

  return (

    <NexaCard>

      <NexaText variant="h2">

        {title}

      </NexaText>

      {!!subtitle && (

        <>
          <NexaSpacer size="xs" />

          <NexaText
            color={Colors.textSecondary}
          >
            {subtitle}
          </NexaText>

        </>

      )}

      {!!children && (

        <>
          <NexaSpacer size="lg" />
          {children}
        </>

      )}

      {!!footer && (

        <>
          <NexaSpacer />
          {footer}
        </>

      )}

      {

        actions.length > 0 && (

          <>

            <NexaSpacer size="lg" />

            <View style={styles.actions}>

              {

                actions.map(action => (

                  <NexaButton

                    key={action.title}

                    title={action.title}

                    variant={
                      action.variant ??
                      "secondary"
                    }

                    onPress={
                      action.onPress
                    }

                  />

                ))

              }

            </View>

          </>

        )

      }

    </NexaCard>

  );

}

const styles = StyleSheet.create({

  actions: {

    gap: Spacing.sm,

  },

});