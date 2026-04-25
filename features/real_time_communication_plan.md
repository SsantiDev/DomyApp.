# Plan de Implementación: Sistema de Comunicación en Tiempo Real 🟢 (Implementado)

> **Estado**: Implementado. Migrado de polling hacia WebSockets y Notificaciones Push.

---

## Estado Actual

- `ChatRoom.tsx` usa `refetchInterval: 3000` (polling REST cada 3 s)
- No hay Django Channels, ni consumers, ni Redis
- Dashboards (`WorkerDashboard`, `ClientDashboard`) también pollan

---

## Objetivos

- Mensajes de chat y cambios de estado reflejados instantáneamente
- Alertas push cuando app cerrada, WS cuando app abierta
- Redis como channel layer (en producción); `InMemoryChannelLayer` en desarrollo

---

## 1. Backend (Django + Channels)

### Dependencias
```bash
pip install channels daphne channels-redis
```

### Configuración ASGI (`core/asgi.py`)
```python
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from apps.chat.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})
```

### URL Routing (`apps/chat/routing.py`) — archivo nuevo
```python
path('ws/chat/<int:service_id>/', ChatConsumer.as_asgi()),
path('ws/notifications/', NotificationConsumer.as_asgi()),
path('ws/tracking/<int:service_id>/', TrackingConsumer.as_asgi()),
```

### Channel Layer (`settings.py`)
```python
# Desarrollo (sin Redis)
CHANNEL_LAYERS = {"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}}

# Producción
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {"hosts": [("redis", 6379)]},
    }
}
```

### Consumers

**`ChatConsumer`** (`apps/chat/consumers.py`)
- Group name: `chat_service_{service_id}`
- `receive`: valida permiso del usuario → guarda en DB → broadcast al grupo
- `chat_message`: envía al WebSocket del cliente
- Al conectar: marcar mensajes no leídos como leídos (reemplaza lógica actual de `get_queryset`)

**`NotificationConsumer`** (`apps/notifications/consumers.py`)
- Group name: `user_{user_id}`
- Eventos: `service_update` (cambio de estado), `new_request_available` (nueva solicitud para operarias)

### Autenticación WS (`JWTAuthMiddleware`)
- Leer token desde query param: `ws://host/ws/chat/1/?token=<jwt>`
- Rechazar conexión si token inválido o expirado (close code 4001)

### Señales Django (`signals.py`)
Disparar push y WS broadcast cuando:
- `ServiceRequest` creado → notificar operarias de la categoría
- Estado cambia a `ACCEPTED`/`IN_PROGRESS`/`COMPLETED` → notificar cliente
- Mensaje recibido y receptor no tiene socket activo → enviar push

---

## 2. Frontend (React Native + Expo)

### Estrategia dual REST + WS (crítico)
Al abrir `ChatRoom`:
1. Cargar historial vía REST (endpoint existente) — igual que hoy
2. Conectar WS → solo mensajes nuevos llegan por socket
3. **Eliminar** `refetchInterval: 3000` de `useChat.ts` cuando WS conectado

### Hook Central (`hooks/useWebSocket.ts`)
```ts
interface UseWebSocketOptions {
  url: string;
  onMessage: (event: RealTimeEvent) => void;
  enabled: boolean; // conectar solo cuando modal visible
}

// Variables de estado
isConnected: boolean
lastMessage: RealTimeEvent | null

// Reconnect con exponential backoff
// Listeners de AppState: reconectar al volver del background
```

### Ciclo de vida en móvil (crítico)
```ts
import { AppState } from 'react-native';

// En useWebSocket.ts
useEffect(() => {
  const sub = AppState.addEventListener('change', (state) => {
    if (state === 'active') reconnect();
    if (state === 'background') ws.current?.close();
  });
  return () => sub.remove();
}, []);
```

### Integración en componentes
- `ChatRoom.tsx`: conectar a `ws/chat/{serviceId}/?token=...` solo si `visible === true`
- `TabIndexScreen.tsx` / dashboards: conectar a `ws/notifications/?token=...` → invalidar queries de React Query al recibir evento (elimina polling de dashboards)

### Ack de mensajes leídos
Al conectar a un ChatRoom, enviar evento `mark_read` via WS:
```ts
ws.send(JSON.stringify({ type: 'mark_read', service_id: serviceId }))
```
El consumer marca como leídos en DB. Elimina la lógica de `is_read` en `get_queryset`.

### Notificaciones Push (Expo Notifications)
- Capturar `ExpoPushToken` al iniciar sesión → guardar en `User.push_token` (backend)
- Push solo si receptor **no** tiene socket activo (verificar en consumer)
- Configurar `notification-handler` en `app/_layout.tsx`

### Tipos
```ts
interface RealTimeEvent {
    type: 'CHAT' | 'STATUS_CHANGE' | 'SYSTEM_ALERT' | 'MARK_READ';
    payload: any;
    timestamp: string;
}
```

---

## 3. Modelo Backend — campo nuevo
```python
# apps/users/models.py
push_token = models.CharField(max_length=200, blank=True, null=True)
```
Migración requerida tras agregar campo.

---

## 4. Plan de Acción

| Fase | Alcance | Bloqueantes |
|------|---------|-------------|
| 1 | `asgi.py` + `ChatConsumer` + `JWTMiddleware` + `InMemoryLayer` (dev) | Ninguno |
| 2 | Eliminar `refetchInterval` en `useChat.ts` · `useWebSocket.ts` con AppState | Fase 1 |
| 3 | `NotificationConsumer` + eliminar polling en dashboards | Fase 1 |
| 4 | Push notifications (Expo token + signals Django) | Fase 3 |
| 5 | Redis en staging + pruebas de estrés y desconexiones | Fase 4 |
