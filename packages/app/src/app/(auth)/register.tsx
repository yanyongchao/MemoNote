import { router } from "expo-router";
import { Button, Typography } from "heroui-native";
import { useState } from "react";
import { View } from "react-native";

import { AuthField, AuthScreen } from "@/components/auth-screen";
import { toast } from "@/libs/toast";
import { useAuthStore } from "@/stores/auth-store";

export default function RegisterScreen() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setSubmitting] = useState(false);
	const register = useAuthStore((state) => state.register);

	const canSubmit = email.trim().length > 0 && password.length >= 8 && !isSubmitting;

	async function handleSubmit() {
		if (!canSubmit) {
			if (password.length > 0 && password.length < 8) {
				toast.warning("密码至少需要 8 位");
			}
			return;
		}

		setSubmitting(true);
		try {
			await register({
				name: name.trim() || undefined,
				email: email.trim(),
				password,
			});
			toast.success("注册成功");
			router.replace("/");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<AuthScreen
			title="创建账号"
			subtitle="用邮箱注册，开始建立只属于你的 Memo Note。"
			footerText="已经有账号？"
			footerAction="登录"
			footerHref="/login"
		>
			<View className="gap-4">
				<AuthField
					label="昵称"
					value={name}
					onChangeText={setName}
					placeholder="可选"
					textContentType="name"
					autoComplete="name"
				/>
				<AuthField
					label="邮箱"
					value={email}
					onChangeText={setEmail}
					placeholder="you@example.com"
					keyboardType="email-address"
					textContentType="emailAddress"
					autoComplete="email"
				/>
				<AuthField
					label="密码"
					value={password}
					onChangeText={setPassword}
					placeholder="至少 8 位"
					secureTextEntry
					textContentType="newPassword"
					autoComplete="new-password"
					returnKeyType="done"
				/>
			</View>

			<Button className="w-full" isDisabled={!canSubmit} onPress={handleSubmit}>
				{isSubmitting ? "创建中..." : "注册并进入首页"}
			</Button>

			<Typography.Paragraph color="muted" type="body-sm">
				注册成功后会自动登录，并进入首页。
			</Typography.Paragraph>
		</AuthScreen>
	);
}
