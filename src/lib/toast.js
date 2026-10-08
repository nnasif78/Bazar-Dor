"use client";

import { toast } from "react-toastify";

export const PROFILE_AUTH_TOAST_KEY = "bazar-dor:profile-auth-toast";

const ICONS = {
    success: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
    error: "https://uxwing.com/wp-content/themes/uxwing/download/signs-and-symbols/alert-icon.png",
    alert: "https://uxwing.com/wp-content/themes/uxwing/download/signs-and-symbols/alert-icon.png",
};

const options = icon => ({
    autoClose: 3000,
    closeButton: false,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    icon: <img src={icon} alt="" width="24" height="24" />,
});

export const showToast = {
    success: message => toast.success(message, options(ICONS.success)),
    error: message => toast.error(message, options(ICONS.error)),
    alert: message => toast.warning(message, options(ICONS.alert)),
};
