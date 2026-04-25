# Push Notifications — Implementación Pendiente

## Estado actual

Las notificaciones push (background) están **deshabilitadas** mientras se usa Expo Go.
`usePushToken` es un stub vacío — no registra token, no envía nada al backend.

**Motivo:** `expo-notifications` crashea al importarse en Expo Go SDK 53+.
No es un bug del código — es una limitación de Expo Go que no tiene solución con guards.

Todo lo que funciona con la app **abierta** (WebSockets, chat en tiempo real, actualización de dashboards) **no se ve afectado**.

---

## Qué se pierde sin push

| Escenario | Impacto |
|---|---|
| App cerrada — operaria recibe nueva solicitud | No llega alerta al dispositivo |
| App cerrada — cliente ve cambio de estado | No llega alerta al dispositivo |
| App en background — mensaje de chat nuevo | No llega alerta al dispositivo |

---

## Qué hay implementado (listo para activar)

### Backend
- `User.push_token` — campo en el modelo (migración `0005_user_push_token`)
- `POST /api/users/push-token/` — endpoint que guarda el token del dispositivo
- `apps/notifications/signals.py` — ya envía push cuando la app lo soporte (señales en `ServiceRequest`)

### Frontend
- `hooks/usePushToken.ts` — stub listo para restaurar
- `_layout.tsx` — ya llama a `usePushToken(!!user)` en el componente raíz

---

## Pasos para activar

### 1. Configurar EAS
```bash
cd Fronted
npx eas init
```
Esto genera un `projectId` en EAS y lo agrega automáticamente al `app.json`.

### 2. Agregar projectId al app.json manualmente si no lo hace automáticamente
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "tu-project-id-aqui"
      }
    }
  }
}
```

### 3. Restaurar la implementación en usePushToken.ts

Reemplazar el contenido actual del stub con:

```typescript
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from '../services/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenData.data;
}

export function usePushToken(isAuthenticated: boolean) {
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      // WS maneja el UI en tiempo real; este listener cubre edge cases
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
      // TODO: navegar a la pantalla relevante según la notificación
    });
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    registerForPushNotificationsAsync().then(async (token) => {
      if (!token) return;
      try {
        await api.post('users/push-token/', { push_token: token });
      } catch {
        // No crítico
      }
    });
  }, [isAuthenticated]);
}
```

### 4. Instalar dependencias si no están
```bash
cd Fronted
npx expo install expo-notifications expo-device
```

### 5. Generar development build
```bash
# Android
npx eas build --profile development --platform android

# iOS
npx eas build --profile development --platform ios
```

Instalar el `.apk`/`.ipa` generado en el dispositivo físico en lugar de Expo Go.

---

## Dependencias involucradas

| Paquete | Estado |
|---|---|
| `expo-notifications` | Instalado — no importar en Expo Go |
| `expo-device` | Instalado |
| `expo-constants` | Instalado |

---

## Archivos clave

| Archivo | Rol |
|---|---|
| `Fronted/hooks/usePushToken.ts` | Hook principal — actualmente stub |
| `Fronted/app/_layout.tsx` | Llama `usePushToken(!!user)` — no tocar |
| `Backend/apps/users/models.py` | Campo `push_token` listo |
| `Backend/apps/users/views.py` | Endpoint `POST users/push-token/` listo |
| `Backend/apps/notifications/signals.py` | Envío de push al backend listo |
