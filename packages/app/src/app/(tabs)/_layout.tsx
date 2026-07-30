import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps, JSX } from "react";
import type { ColorValue } from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, color }: { name: IoniconName; color: ColorValue }): JSX.Element {
  return <Ionicons name={name} size={24} color={color} />;
}

export default function TabsLayout(): JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          borderTopColor: "#e5e7eb",
          height: 84,
          paddingBottom: 24,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首页",
          tabBarIcon: ({ color }) => <TabIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "收藏",
          tabBarIcon: ({ color }) => <TabIcon name="star-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "我的",
          tabBarIcon: ({ color }) => <TabIcon name="person-circle-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
