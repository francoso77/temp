import { Alert } from "react-native";

type Props = {

  title?: string;

  message: string;

  confirmText?: string;

  cancelText?: string;

  destructive?: boolean;

  onConfirm: () => void;

  onCancel?: () => void;

};

export function NexaConfirmDialog({

  title = "Confirmação",

  message,

  confirmText = "Sim",

  cancelText = "Cancelar",

  destructive = false,

  onConfirm,

  onCancel,

}: Props) {

  Alert.alert(

    title,

    message,

    [

      {

        text: cancelText,

        style: "cancel",

        onPress: onCancel,

      },

      {

        text: confirmText,

        style: destructive
          ? "destructive"
          : "default",

        onPress: onConfirm,

      },

    ]

  );

}