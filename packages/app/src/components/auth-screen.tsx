import { Link } from "expo-router";
import { Button, Card, Input, Typography } from "heroui-native";
import type { ReactNode } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { View } from "react-native";

type AuthScreenProps = {
	title: string;
	subtitle: string;
	children: ReactNode;
	footerText: string;
	footerAction: string;
	footerHref: "/login" | "/register";
};

export function AuthScreen({
	title,
	subtitle,
	children,
	footerText,
	footerAction,
	footerHref,
}: AuthScreenProps) {
	return (
		<KeyboardAwareScrollView
			className="flex-1 bg-background"
			contentContainerClassName="min-h-full justify-center px-5 py-10"
			contentInsetAdjustmentBehavior="automatic"
			keyboardShouldPersistTaps="handled"
			bottomOffset={28}
		>
			<View className="gap-7">
				<View className="gap-3">
					<View className="h-12 w-12 items-center justify-center rounded-2xl bg-foreground">
						<Typography.Heading className="text-background" type="h4">
							M
						</Typography.Heading>
					</View>
					<View className="gap-2">
						<Typography.Heading type="h1">{title}</Typography.Heading>
						<Typography.Paragraph color="muted">{subtitle}</Typography.Paragraph>
					</View>
				</View>

				<Card className="gap-5 p-5">{children}</Card>

				<View className="flex-row items-center justify-center gap-1">
					<Typography.Paragraph color="muted">{footerText}</Typography.Paragraph>
					<Link href={footerHref} asChild>
						<Button variant="ghost" size="sm">
							{footerAction}
						</Button>
					</Link>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
}

type AuthFieldProps = {
	label: string;
	value: string;
	onChangeText: (value: string) => void;
	placeholder: string;
	secureTextEntry?: boolean;
	keyboardType?: "default" | "email-address";
	textContentType?: "emailAddress" | "password" | "newPassword" | "name";
	autoComplete?: "email" | "password" | "new-password" | "name";
	returnKeyType?: "next" | "done";
};

export function AuthField({
	label,
	value,
	onChangeText,
	placeholder,
	secureTextEntry,
	keyboardType = "default",
	textContentType,
	autoComplete,
	returnKeyType = "next",
}: AuthFieldProps) {
	return (
		<View className="gap-2">
			<Typography.Paragraph weight="medium">{label}</Typography.Paragraph>
			<Input
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				autoCapitalize="none"
				autoCorrect={false}
				keyboardType={keyboardType}
				textContentType={textContentType}
				autoComplete={autoComplete}
				secureTextEntry={secureTextEntry}
				returnKeyType={returnKeyType}
			/>
		</View>
	);
}
