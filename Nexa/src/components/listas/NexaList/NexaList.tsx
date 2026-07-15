import { ActivityIndicator, FlatList } from "react-native";

import { NexaEmptyState } from '@/components/layout';
import { Colors } from "../../../theme";

type Props<T> = {
  data: T[];

  renderItem: (item: T) => React.ReactElement;

  keyExtractor: (item: T) => string;

  emptyTitle?: string;

  emptyMessage?: string;

  loading?: boolean;
};

export function NexaList<T>({
  data,
  renderItem,
  keyExtractor,
  emptyTitle = "Nada encontrado",
  emptyMessage = "",
  loading = false,
}: Props<T>) {
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.primary}
      />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => renderItem(item)}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <NexaEmptyState
          title={emptyTitle}
          subtitle={emptyMessage}
        />
      }
    />
  );
}