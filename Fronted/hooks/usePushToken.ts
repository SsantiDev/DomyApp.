// Push notifications require a development build with EAS (projectId configured).
// expo-notifications crashes on import in Expo Go SDK 53+, so all push logic
// is disabled until a proper build is set up.
// To enable: run `npx eas init`, add projectId to app.json extra.eas, then
// restore the full implementation using expo-notifications + expo-device.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function usePushToken(_isAuthenticated: boolean) {
  // no-op in Expo Go / until EAS is configured
}
