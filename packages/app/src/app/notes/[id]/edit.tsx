import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Typography } from "heroui-native";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from "react-native";

import { getNote, updateNote } from "@/api/notes";
import { toast } from "@/libs/toast";

export default function EditNoteScreen(): JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const noteId = Number(id);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void getNote(noteId)
      .then((note) => {
        setTitle(note.title);
        setContent(note.content);
      })
      .finally(() => setIsLoading(false));
  }, [noteId]);

  async function handleSave() {
    if (!title.trim()) {
      toast.error("请输入标题");
      return;
    }

    setIsSaving(true);
    try {
      await updateNote(noteId, { title: title.trim(), content: content.trim() });
      router.replace(`/notes/${noteId}`);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#ffb31a" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-row items-center justify-between px-5 pb-4 pt-8">
        <Pressable className="h-10 w-10 justify-center" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={25} color="#111827" />
        </Pressable>
        <Typography.Heading type="h3">编辑笔记</Typography.Heading>
        <Pressable disabled={isSaving} onPress={handleSave}>
          <Typography.Paragraph className="text-[#f5a400]">{isSaving ? "保存中" : "保存"}</Typography.Paragraph>
        </Pressable>
      </View>

      <View className="flex-1 px-5">
        <TextInput
          className="py-6 text-2xl font-semibold text-foreground"
          placeholder="请输入标题"
          placeholderTextColor="#c5c8ce"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="flex-1 text-base leading-7 text-foreground"
          multiline
          placeholder="开始记录你的想法..."
          placeholderTextColor="#c5c8ce"
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
