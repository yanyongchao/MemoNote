import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Typography } from "heroui-native";
import type { JSX } from "react";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, View } from "react-native";

import { deleteNote, getNote, updateNoteState, type Note } from "@/api/notes";
import { formatServerDateTime } from "@/libs/datetime";

export default function NoteDetailScreen(): JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const noteId = Number(id);
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadNote = useCallback(async () => {
    setIsLoading(true);
    try {
      setNote(await getNote(noteId));
    } finally {
      setIsLoading(false);
    }
  }, [noteId]);

  useFocusEffect(
    useCallback(() => {
      void loadNote();
    }, [loadNote]),
  );

  async function patchState(input: Partial<Pick<Note, "isPinned" | "isFavorite">>) {
    setNote(await updateNoteState(noteId, input));
  }

  function confirmDelete() {
    Alert.alert("删除笔记", "删除后无法恢复，确认删除吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: async () => {
          await deleteNote(noteId);
          router.replace("/");
        },
      },
    ]);
  }

  if (isLoading || !note) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#ffb31a" />
      </View>
    );
  }

  const updatedAt = formatServerDateTime(note.updatedAt);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-5 pb-4 pt-8">
        <Pressable className="h-10 w-10 justify-center" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={25} color="#111827" />
        </Pressable>
        <View className="flex-row gap-5">
          <Pressable onPress={() => router.push(`/notes/${note.id}/edit`)}>
            <Ionicons name="create-outline" size={23} color="#111827" />
          </Pressable>
          <Pressable onPress={confirmDelete}>
            <Ionicons name="trash-outline" size={23} color="#ef4444" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-5 px-5 pb-28 pt-4">
        <View className="flex-row items-center justify-between">
          <Pressable className="flex-row items-center gap-1" onPress={() => patchState({ isPinned: !note.isPinned })}>
            <Ionicons name={note.isPinned ? "pin" : "pin-outline"} size={18} color="#ffb31a" />
            <Typography.Paragraph color="muted">{note.isPinned ? "置顶" : "未置顶"}</Typography.Paragraph>
          </Pressable>
          <Typography.Paragraph color="muted">
            {updatedAt.date} {updatedAt.time}
          </Typography.Paragraph>
        </View>

        <Typography.Heading type="h2">{note.title}</Typography.Heading>
        <Typography.Paragraph className="leading-7">{note.content || "没有正文内容"}</Typography.Paragraph>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around border-t border-gray-100 bg-background px-8 py-5">
        <Pressable onPress={() => patchState({ isPinned: !note.isPinned })}>
          <Ionicons name={note.isPinned ? "pin" : "pin-outline"} size={24} color="#ffb31a" />
        </Pressable>
        <Pressable onPress={() => patchState({ isFavorite: !note.isFavorite })}>
          <Ionicons name={note.isFavorite ? "star" : "star-outline"} size={24} color="#6b7280" />
        </Pressable>
        <Pressable onPress={confirmDelete}>
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
}
