import {
  NexaButton,
} from "@/components";

import {
  StyleSheet,
  View,
} from "react-native";

import { ServiceFilter as Filter } from "../types";

type Props = {

  value: Filter;

  onChange: (value: Filter) => void;

};

export function ServiceFilter({

  value,

  onChange,

}: Props) {

  return (

    <View style={styles.container}>

      <NexaButton

        title="Todos"

        variant={

          value === "all"

            ? "primary"

            : "secondary"

        }

        fullWidth={false}

        onPress={() => onChange("all")}

      />

      <NexaButton

        title="Ativos"

        variant={

          value === "active"

            ? "primary"

            : "secondary"

        }

        fullWidth={false}

        onPress={() => onChange("active")}

      />

      <NexaButton

        title="Inativos"

        variant={

          value === "inactive"

            ? "primary"

            : "secondary"

        }

        fullWidth={false}

        onPress={() => onChange("inactive")}

      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flexDirection: "row",

    justifyContent: "space-between",

    gap: 8,

  },

});