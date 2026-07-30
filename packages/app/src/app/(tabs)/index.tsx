import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Button, Card, Typography } from "heroui-native";
import type { JSX } from "react";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from "react-native";

import { getNotes, updateNoteState, type Note } from "@/api/notes";
import { formatServerDateTime } from "@/libs/datetime";
import { useAuthStore } from "@/stores/auth-store";

export default function HomeTab(): JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  const loadNotes = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    setIsLoading(true);
    try {
      setNotes(await getNotes());
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      void loadNotes();
    }, [loadNotes]),
  );

  async function refreshNotes() {
    setIsRefreshing(true);
    try {
      setNotes(await getNotes());
    } finally {
      setIsRefreshing(false);
    }
  }

  async function toggleFavorite(note: Note) {
    await updateNoteState(note.id, { isFavorite: !note.isFavorite });
    await refreshNotes();
  }

  async function togglePinned(note: Note) {
    await updateNoteState(note.id, { isPinned: !note.isPinned });
    await refreshNotes();
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-28 pt-16"
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshNotes} />}
      >
        <View className="flex-row items-center justify-between">
          <Typography.Heading type="h1">全部笔记</Typography.Heading>
          <Pressable
            accessibilityLabel="搜索笔记"
            className="h-11 w-11 items-center justify-center rounded-full"
            onPress={() => router.push("/search")}
          >
            <Ionicons name="search-outline" size={25} color="#111827" />
          </Pressable>
        </View>

        {isLoading ? (
          <View className="min-h-[360px] items-center justify-center">
            <ActivityIndicator color="#ffb31a" />
          </View>
        ) : notes.length === 0 ? (
          <Card className="min-h-[420px] justify-center gap-5 p-6">
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
            <Button className="w-full" onPress={() => router.push("/notes/new")}>
              新建笔记
            </Button>
          </Card>
        ) : (
          <View className="gap-6">
            {notes.some((note) => note.isPinned) ? (
              <View className="gap-3">
                <Typography.Paragraph color="muted">置顶</Typography.Paragraph>
                {notes
                  .filter((note) => note.isPinned)
                  .map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      featured
                      onFavorite={() => toggleFavorite(note)}
                      onPin={() => togglePinned(note)}
                    />
                  ))}
              </View>
            ) : null}

            <View className="gap-3">
              <Typography.Paragraph color="muted">全部笔记</Typography.Paragraph>
              {notes
                .filter((note) => !note.isPinned)
                .map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onFavorite={() => toggleFavorite(note)}
                    onPin={() => togglePinned(note)}
                  />
                ))}
            </View>
          </View>
        )}
      </ScrollView>

      <Pressable
        accessibilityLabel="新建笔记"
        className="absolute bottom-24 right-5 h-16 w-16 items-center justify-center rounded-full bg-[#ffb31a] shadow-lg"
        onPress={() => router.push("/notes/new")}
      >
        <Ionicons name="add" size={34} color="#ffffff" />
      </Pressable>
    </View>
  );
}

function NoteCard({
  note,
  featured = false,
  onFavorite,
  onPin,
}: {
  note: Note;
  featured?: boolean;
  onFavorite: () => void;
  onPin: () => void;
}): JSX.Element {
  const updatedAt = formatServerDateTime(note.updatedAt);

  return (
    <Pressable onPress={() => router.push(`/notes/${note.id}`)}>
      <Card className={`gap-3 p-5 ${featured ? "bg-[#fff2d2]" : ""}`}>
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1 gap-1">
            <Typography.Heading type="h3">{note.title}</Typography.Heading>
            <Typography.Paragraph color={featured ? undefined : "muted"} numberOfLines={2}>
              {note.content || "没有正文内容"}
            </Typography.Paragraph>
          </View>
          <View className="flex-row gap-2">
            <Pressable accessibilityLabel="切换置顶" onPress={onPin}>
              <Ionicons name={note.isPinned ? "pin" : "pin-outline"} size={20} color="#ffb31a" />
            </Pressable>
            <Pressable accessibilityLabel="切换收藏" onPress={onFavorite}>
              <Ionicons name={note.isFavorite ? "star" : "star-outline"} size={20} color="#ffb31a" />
            </Pressable>
          </View>
        </View>
        <Typography.Paragraph color="muted">
          {updatedAt.date}  {updatedAt.time}
        </Typography.Paragraph>
      </Card>
    </Pressable>
  );
}
