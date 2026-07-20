import {
  NexaButton,
  NexaSpacer,
} from "@/components";

type Props = {

  onSave: () => void;

  onCancel?: () => void;

  loading?: boolean;

  saveText?: string;

  cancelText?: string;

};

export function NexaFormActions({

  onSave,

  onCancel,

  loading = false,

  saveText = "Salvar",

  cancelText = "Cancelar",

}: Props) {

  return (

    <>

      {onCancel && (

        <>

          <NexaButton

            title={cancelText}

            variant="secondary"

            onPress={onCancel}

          />

          <NexaSpacer />

        </>

      )}

      <NexaButton

        title={saveText}

        loading={loading}

        onPress={onSave}

      />

    </>

  );

}