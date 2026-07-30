import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Button, Card, Typography } from "heroui-native";
import type { JSX } from "react";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { getNotes, updateNoteState, type Note } from "@/api/notes";
import { formatServerDateTime } from "@/libs/datetime";

export default function FavoritesTab(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      setNotes(await getNotes({ favorite: true }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadFavorites();
    }, [loadFavorites]),
  );

  async function removeFavorite(note: Note) {
    await updateNoteState(note.id, { isFavorite: false });
    await loadFavorites();
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="gap-6 px-5 pb-28 pt-16">
        <View className="gap-2">
          <Typography.Heading type="h1">收藏</Typography.Heading>
          <Typography.Paragraph color="muted">
            这里会集中展示你标记收藏的备忘录。
          </Typography.Paragraph>
        </View>

        {isLoading ? (
          <View className="min-h-[360px] items-center justify-center">
            <ActivityIndicator color="#ffb31a" />
          </View>
        ) : notes.length === 0 ? (
          <Card className="min-h-[420px] justify-center gap-5 p-6">
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
        ) : (
          <View className="gap-3">
            {notes.map((note) => {
              const updatedAt = formatServerDateTime(note.updatedAt);

              return (
                <Pressable key={note.id} onPress={() => router.push(`/notes/${note.id}`)}>
                  <Card className="gap-2 p-5">
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="min-w-0 flex-1 gap-1">
                        <Typography.Heading type="h3">{note.title}</Typography.Heading>
                        <Typography.Paragraph color="muted" numberOfLines={2}>
                          {note.content || "没有正文内容"}
                        </Typography.Paragraph>
                      </View>
                      <Pressable accessibilityLabel="取消收藏" onPress={() => removeFavorite(note)}>
                        <Ionicons name="star" size={21} color="#ffb31a" />
                      </Pressable>
                    </View>
                    <Typography.Paragraph color="muted">
                      {updatedAt.date}  {updatedAt.time}
                    </Typography.Paragraph>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
