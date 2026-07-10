import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#5B6CFF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Hoje",
        }}
      />

      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
        }}
      />

      <Tabs.Screen
        name="nexa"
        options={{
          title: "Nexa",
        }}
      />
    </Tabs>
  );
}