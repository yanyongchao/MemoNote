import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card, Typography } from "heroui-native";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from "react-native";

import { getNotes, type Note } from "@/api/notes";
import { formatServerDateTime } from "@/libs/datetime";

export default function SearchScreen(): JSX.Element {
  const [keyword, setKeyword] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        setNotes(await getNotes({ q: keyword.trim() }));
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-5 pb-4 pt-8">
        <View className="h-11 flex-1 flex-row items-center gap-2 rounded-full bg-gray-100 px-4">
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <TextInput
            autoFocus
            className="min-w-0 flex-1 text-base text-foreground"
            placeholder="搜索笔记"
            placeholderTextColor="#9ca3af"
            value={keyword}
            onChangeText={setKeyword}
          />
          {keyword ? (
            <Pressable onPress={() => setKeyword("")}>
              <Ionicons name="close" size={18} color="#9ca3af" />
            </Pressable>
          ) : null}
        </View>
        <Pressable onPress={() => router.back()}>
          <Typography.Paragraph color="muted">取消</Typography.Paragraph>
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-5 pb-10">
        <Typography.Paragraph color="muted">找到 {notes.length} 条结果</Typography.Paragraph>
        {isLoading ? (
          <View className="py-10">
            <ActivityIndicator color="#ffb31a" />
          </View>
        ) : (
          notes.map((note) => {
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
                    <Ionicons name={note.isPinned ? "pin" : "ellipsis-vertical"} size={18} color="#ffb31a" />
                  </View>
                  <Typography.Paragraph color="muted">
                    {updatedAt.date}  {updatedAt.time}
                  </Typography.Paragraph>
                </Card>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
