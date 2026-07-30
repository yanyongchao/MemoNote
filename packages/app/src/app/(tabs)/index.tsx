import { router } from "expo-router";
import { Button, Card, Typography } from "heroui-native";
import type { JSX } from "react";
import { useEffect } from "react";
import { View } from "react-native";

import { useAuthStore } from "@/stores/auth-store";

export default function HomeTab(): JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrateAuth = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  return (
    <View className="flex-1 bg-background px-5 py-8">
      <View className="flex-1 gap-6">
        <View className="gap-2">
          <Typography.Heading type="h1">Memo Note</Typography.Heading>
          <Typography.Paragraph color="muted">
            快速记录灵感、待办事项和日常笔记。
          </Typography.Paragraph>
        </View>

        <Card className="flex-1 justify-center gap-5 p-6">
          <View className="h-16 w-16 items-center justify-center rounded-3xl bg-foreground">
            <Typography.Heading className="text-background" type="h3">
              +
            </Typography.Heading>
          </View>
          <View className="gap-2">
            <Typography.Heading type="h3">还没有笔记</Typography.Heading>
            <Typography.Paragraph color="muted">
              创建第一条备忘录，保存今天不想忘记的事情。
            </Typography.Paragraph>
          </View>
          <Button className="w-full">新建笔记</Button>
        </Card>
      </View>
    </View>
  );
}
