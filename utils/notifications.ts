

export const showNotification = (title: string, options?: NotificationOptions) => {
}
    // Check if notifications are supported and permission is granted
    if (&apos;Notification&apos; in window && Notification.permission === &apos;granted&apos;) {
}
        new Notification(title, {
}
            ...options,
            icon: &apos;/favicon.svg&apos;,
            body: options?.body || &apos;Astral Draft&apos;,
            tag: title, // Use title as tag to prevent multiple notifications for same event
        });
    }
}

export const requestNotificationPermission = async (dispatch: React.Dispatch<any>) => {
}
    if (&apos;Notification&apos; in window) {
}
        const permission = await Notification.requestPermission();
        dispatch({ type: &apos;SET_NOTIFICATION_PERMISSION&apos;, payload: permission });
        if (permission === &apos;granted&apos;) {
}
            showNotification(&apos;Notifications Enabled!&apos;, { body: &apos;You will now receive alerts from Astral Draft.&apos; });
        }
    } else {
}
        dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Browser does not support notifications.&apos;, type: &apos;SYSTEM&apos; } });
    }
}