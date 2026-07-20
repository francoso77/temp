import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import {
  Colors,
  Radius,
  Shadows,
  Spacing,
} from "@/theme";

import {
  NexaInput,
  NexaText,
} from "@/components";

type Item = Record<string, any>;

type Props<T extends Item> = {

  label?: string;

  items: T[];

  value?: string;

  labelKey: keyof T;

  valueKey: keyof T;

  placeholder?: string;

  onChange: (value: string) => void;

};

export function NexaAutocomplete<T extends Item>({
  label,
  items,
  value,
  labelKey,
  valueKey,
  placeholder = "Selecione...",
  onChange,
}: Props<T>) {

  const [visible, setVisible] = useState(false);

  const [search, setSearch] = useState("");

  const selected = items.find(
    item => String(item[valueKey]) === value
  );

  const filtered = useMemo(() => {

    return items.filter(item =>
      String(item[labelKey])
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [items, search]);

  return (

    <>

      <Pressable
        onPress={() => setVisible(true)}
      >

        <View pointerEvents="none">

          <NexaInput
            label={label}
            value={
              selected
                ? String(selected[labelKey])
                : ""
            }
            placeholder={placeholder}
            editable={false}
          />

        </View>

      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
      >

        <View style={styles.container}>

          <NexaInput
            label="Pesquisar"
            value={search}
            onChangeText={setSearch}
            placeholder="Digite..."
          />

          <ScrollView
            style={styles.list}
          >

            {filtered.map(item => (

              <Pressable

                key={String(item[valueKey])}

                style={styles.item}

                onPress={() => {

                  onChange(
                    String(item[valueKey])
                  );

                  setVisible(false);

                  setSearch("");

                }}

              >

                <NexaText>

                  {String(item[labelKey])}

                </NexaText>

              </Pressable>

            ))}

          </ScrollView>

        </View>

      </Modal>

    </>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    padding: Spacing.lg,

    backgroundColor: Colors.background,

  },

  list: {

    marginTop: Spacing.md,

  },

  item: {

    padding: Spacing.md,

    backgroundColor: Colors.surface,

    borderRadius: Radius.md,

    marginBottom: Spacing.sm,

    ...Shadows.card,

  },

});