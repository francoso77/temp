import { FlatList } from "react-native";

import { NexaEmptyState } from "@/components";

type Props<T> = {

  data: T[];

  renderItem: (item: T) => React.ReactElement;

  keyExtractor: (item: T) => string;

  emptyTitle: string;

  emptyDescription: string;

};

export function NexaCrudList<T>({

  data,

  renderItem,

  keyExtractor,

  emptyTitle,

  emptyDescription,

}: Props<T>) {

  return (

    <FlatList

      data={data}

      keyExtractor={keyExtractor}

      renderItem={({ item }) => renderItem(item)}

      showsVerticalScrollIndicator={false}

      ListEmptyComponent={

        <NexaEmptyState

          emoji="📂"

          title={emptyTitle}

          subtitle={emptyDescription}

        />

      }

    />

  );

}