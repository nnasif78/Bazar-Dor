"use client";

import { toast } from "react-hot-toast";

export const PROFILE_AUTH_TOAST_KEY = "bazar-dor:profile-auth-toast";

export const showToast = {
    success: message => toast.success(message, { duration: 3000, icon: "✅" }),
    error: message => toast.error(message, { duration: 3000, icon: "⚠️" }),
    alert: message => toast(message, { duration: 3000, icon: "⚠️" }),
};
