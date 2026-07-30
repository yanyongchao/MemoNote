import { router } from "expo-router";
import { Button, Card, Typography } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";

export default function FavoritesTab(): JSX.Element {
  return (
    <View className="flex-1 bg-background px-5 py-8">
      <View className="flex-1 gap-6">
        <View className="gap-2">
          <Typography.Heading type="h1">收藏</Typography.Heading>
          <Typography.Paragraph color="muted">
            这里会集中展示你标记收藏的备忘录。
          </Typography.Paragraph>
        </View>

        <Card className="flex-1 justify-center gap-5 p-6">
          <View className="h-16 w-16 items-center justify-center rounded-3xl bg-foreground">
            <Typography.Heading className="text-background" type="h3">
              ★
            </Typography.Heading>
          </View>
          <View className="gap-2">
            <Typography.Heading type="h3">还没有收藏</Typography.Heading>
            <Typography.Paragraph color="muted">
              在首页给重要备忘录加星，它们会出现在这里。
            </Typography.Paragraph>
          </View>
          <Button className="w-full" variant="secondary" onPress={() => router.push("/")}>
            回到首页
          </Button>
        </Card>
      </View>
    </View>
  );
}
