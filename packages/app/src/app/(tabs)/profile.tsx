import { router } from "expo-router";
import { Button, Card, Typography } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";

import { useAuthStore } from "@/stores/auth-store";

export default function ProfileTab(): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const displayName = user?.name || "未命名用户";
  const initial = displayName.slice(0, 1).toUpperCase();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <View className="flex-1 bg-background px-5 py-8">
      <View className="flex-1 gap-6">
        <View className="gap-2">
          <Typography.Heading type="h1">我的</Typography.Heading>
          <Typography.Paragraph color="muted">
            管理账号信息和本地会话。
          </Typography.Paragraph>
        </View>

        <Card className="gap-5 p-6">
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-3xl bg-foreground">
              <Typography.Heading className="text-background" type="h3">
                {initial}
              </Typography.Heading>
            </View>
            <View className="min-w-0 flex-1 gap-1">
              <Typography.Heading type="h3">{displayName}</Typography.Heading>
              <Typography.Paragraph color="muted">
                {user?.email || "尚未登录"}
              </Typography.Paragraph>
            </View>
          </View>
        </Card>

        <View className="flex-row gap-3">
          <Card className="flex-1 gap-1 p-4">
            <Typography.Heading type="h3">0</Typography.Heading>
            <Typography.Paragraph color="muted">笔记</Typography.Paragraph>
          </Card>
          <Card className="flex-1 gap-1 p-4">
            <Typography.Heading type="h3">0</Typography.Heading>
            <Typography.Paragraph color="muted">收藏</Typography.Paragraph>
          </Card>
        </View>

        <Card className="gap-4 p-6">
          <View className="gap-1">
            <Typography.Heading type="h3">账号</Typography.Heading>
            <Typography.Paragraph color="muted">
              退出后需要重新登录才能同步和管理备忘录。
            </Typography.Paragraph>
          </View>
          <Button className="w-full" variant="secondary" onPress={handleLogout}>
            退出登录
          </Button>
        </Card>
      </View>
    </View>
  );
}
