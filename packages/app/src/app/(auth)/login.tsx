import { router } from "expo-router";
import { Button, Typography } from "heroui-native";
import { useState } from "react";
import { View } from "react-native";

import { AuthField, AuthScreen } from "@/components/auth-screen";
import { toast } from "@/libs/toast";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setSubmitting] = useState(false);
	const login = useAuthStore((state) => state.login);

	const canSubmit = email.trim().length > 0 && password.length > 0 && !isSubmitting;

	async function handleSubmit() {
		if (!canSubmit) {
			return;
		}

		setSubmitting(true);
		try {
			await login({ email: email.trim(), password });
			toast.success("登录成功");
			router.replace("/");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<AuthScreen
			title="欢迎回来"
			subtitle="登录后继续记录灵感、待办和每天的小事。"
			footerText="还没有账号？"
			footerAction="注册"
			footerHref="/register"
		>
			<View className="gap-4">
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
					placeholder="输入密码"
					secureTextEntry
					textContentType="password"
					autoComplete="password"
					returnKeyType="done"
				/>
			</View>

			<Button className="w-full" isDisabled={!canSubmit} onPress={handleSubmit}>
				{isSubmitting ? "登录中..." : "登录"}
			</Button>

			<Typography.Paragraph color="muted" type="body-sm">
				再次打开应用时，会自动保持登录状态。
			</Typography.Paragraph>
		</AuthScreen>
	);
}
