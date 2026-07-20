import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import {
  Colors,
  Radius,
  Spacing,
} from "@/theme";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function NexaSearchBar({
  value,
  onChangeText,
  placeholder = "Pesquisar...",
}: Props) {

  return (

    <View style={styles.container}>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        style={styles.input}
      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    backgroundColor: Colors.surface,

    borderWidth: 1,

    borderColor: Colors.border,

    borderRadius: Radius.md,

    paddingHorizontal: Spacing.md,

    marginBottom: Spacing.md,

  },

  input: {

    height: 48,

    color: Colors.text,

    fontSize: 16,

  },

});