type ToastVariant = "default" | "accent" | "success" | "warning" | "danger";

type ToastShowOptions = {
	label?: string;
	description?: string;
	variant?: ToastVariant;
	placement?: "top" | "bottom";
	duration?: number | "persistent";
	id?: string;
};

type ToastManager = {
	show: (options: string | ToastShowOptions) => string;
	hide: (ids?: string | string[] | "all") => void;
};

let toastManager: ToastManager | null = null;

export function setToastManager(manager: ToastManager | null) {
	toastManager = manager;
}

function show(message: string, variant: ToastVariant = "default") {
	if (!toastManager) {
		return;
	}

	toastManager.show({
		label: message,
		variant,
		placement: "top",
	});
}

export const toast = {
	show,
	success: (message: string) => show(message, "success"),
	error: (message: string) => show(message, "danger"),
	warning: (message: string) => show(message, "warning"),
	info: (message: string) => show(message, "accent"),
	hide: (ids?: string | string[] | "all") => toastManager?.hide(ids),
};
