import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Typography } from "heroui-native";
import type { JSX } from "react";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from "react-native";

import { createNote } from "@/api/notes";
import { toast } from "@/libs/toast";

export default function NewNoteScreen(): JSX.Element {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      toast.error("请输入标题");
      return;
    }

    setIsSaving(true);
    try {
      const note = await createNote({ title: title.trim(), content: content.trim() });
      router.replace(`/notes/${note.id}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-row items-center justify-between px-5 pb-4 pt-8">
        <Pressable onPress={() => router.back()}>
          <Typography.Paragraph color="muted">取消</Typography.Paragraph>
        </Pressable>
        <Typography.Heading type="h3">新建笔记</Typography.Heading>
        <Pressable disabled={isSaving} onPress={handleSave}>
          <Typography.Paragraph className="text-[#f5a400]">{isSaving ? "保存中" : "保存"}</Typography.Paragraph>
        </Pressable>
      </View>

      <View className="flex-1 px-5">
        <TextInput
          className="py-6 text-3xl font-semibold text-foreground"
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

      <View className="flex-row items-center gap-8 border-t border-gray-100 px-6 py-5">
        <Ionicons name="happy-outline" size={23} color="#6b7280" />
        <Ionicons name="image-outline" size={23} color="#6b7280" />
        <Ionicons name="list-outline" size={23} color="#6b7280" />
      </View>
    </KeyboardAvoidingView>
  );
}
