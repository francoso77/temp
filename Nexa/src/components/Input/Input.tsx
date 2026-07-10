import { StyleSheet, TextInput } from "react-native";

import { Colors } from "../../theme";

type Props = {

  value: string;

  onChangeText: (text: string) => void;

  placeholder: string;

  multiline?: boolean;

};

export function Input({

  value,

  onChangeText,

  placeholder,

  multiline = false

}: Props) {

  return (

    <TextInput

      value={value}

      onChangeText={onChangeText}

      placeholder={placeholder}

      placeholderTextColor={Colors.textSecondary}

      multiline={multiline}

      style={[

        styles.input,

        multiline && styles.multiline

      ]}

    />

  );

}

const styles = StyleSheet.create({

  input: {

    borderWidth: 1,

    borderColor: "#E5E7EB",

    borderRadius: 12,

    paddingHorizontal: 16,

    paddingVertical: 14,

    fontSize: 16,

    color: Colors.text,

    backgroundColor: "#FFF"

  },

  multiline: {

    minHeight: 100,

    textAlignVertical: "top"

  }

});