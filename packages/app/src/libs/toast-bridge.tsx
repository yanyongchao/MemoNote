import { useToast } from "heroui-native";
import { useEffect } from "react";

import { setToastManager } from "@/libs/toast";

export function ToastBridge() {
	const { toast } = useToast();

	useEffect(() => {
		setToastManager(toast);

		return () => {
			setToastManager(null);
		};
	}, [toast]);

	return null;
}
