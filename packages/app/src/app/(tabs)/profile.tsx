import { router, useFocusEffect } from "expo-router";
import { Button, Card, Typography } from "heroui-native";
import type { JSX } from "react";
import { useCallback, useState } from "react";
import { Pressable, View } from "react-native";

import { getNoteStats, type NoteStats } from "@/api/notes";
import { useAuthStore } from "@/stores/auth-store";

export default function ProfileTab(): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [stats, setStats] = useState<NoteStats>({ notes: 0, favorites: 0 });

  const displayName = user?.name || "未命名用户";
  const initial = displayName.slice(0, 1).toUpperCase();

  useFocusEffect(
    useCallback(() => {
      void getNoteStats().then(setStats);
    }, []),
  );

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
            <Typography.Heading type="h3">{stats.notes}</Typography.Heading>
            <Typography.Paragraph color="muted">笔记</Typography.Paragraph>
          </Card>
          <Card className="flex-1 gap-1 p-4">
            <Typography.Heading type="h3">{stats.favorites}</Typography.Heading>
            <Typography.Paragraph color="muted">收藏</Typography.Paragraph>
          </Card>
        </View>

        <Card className="gap-4 p-6">
          <ProfileRow label="清除本地缓存" value="0 KB" />
          <ProfileRow label="关于我们" value="v1.0.0" />
          <Button className="w-full" variant="secondary" onPress={handleLogout}>
            退出登录
          </Button>
        </Card>
      </View>
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <Pressable className="flex-row items-center justify-between py-2">
      <Typography.Paragraph>{label}</Typography.Paragraph>
      <Typography.Paragraph color="muted">{value}</Typography.Paragraph>
    </Pressable>
  );
}
