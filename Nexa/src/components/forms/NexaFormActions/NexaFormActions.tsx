import { StyleSheet, View } from "react-native";

import { NexaButton } from "@/components";

type Props = {

  onSave: () => void;

  onCancel?: () => void;

  loading?: boolean;

  saveText?: string;

  cancelText?: string;

  saveDisabled?: boolean;

  cancelDisabled?: boolean;

  saveVariant?:
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";

  cancelVariant?:
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";

};

export function NexaFormActions({

  onSave,

  onCancel,

  loading = false,

  saveText = "Salvar",

  cancelText = "Cancelar",

  saveDisabled = false,

  cancelDisabled = false,

  saveVariant = "primary",

  cancelVariant = "secondary",

}: Props) {

  return (

    <View style={styles.container}>

      {onCancel && (

        <View style={styles.button}>

          <NexaButton

            title={cancelText}

            variant={cancelVariant}

            disabled={cancelDisabled}

            onPress={onCancel}

          />

        </View>

      )}

      <View style={styles.button}>

        <NexaButton

          title={saveText}

          variant={saveVariant}

          loading={loading}

          disabled={saveDisabled}

          onPress={onSave}

        />

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flexDirection: "row",

    gap: 12,

  },

  button: {

    flex: 1,

  },

});