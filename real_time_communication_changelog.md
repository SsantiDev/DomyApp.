# Changelog: Sistema de Comunicación en Tiempo Real

Fecha de implementación: 2026-04-25
Branch: develop

---

## Resumen

Migración del sistema de polling REST (refetch cada 3-15 s) hacia WebSockets en tiempo real.
Chat, dashboards y notificaciones de estado ahora se actualizan instantáneamente sin peticiones periódicas.

---

## Backend

### Nuevos archivos

#### `Backend/core/middleware.py`
Middleware ASGI que autentica conexiones WebSocket via JWT.
- Lee el token del query param: `ws://.../ws/chat/1/?token=<jwt>`
- Rechaza la conexión con código `4001` si el token es inválido o ha expirado
- Se aplica a todos los consumers antes de que lleguen al handler

#### `Backend/core/asgi.py` ← modificado
Reemplazado el ASGI estándar de Django por `ProtocolTypeRouter`:
- `http` → Django normal (sin cambios para las peticiones REST)
- `websocket` → `JWTAuthMiddleware` → `URLRouter` con rutas de chat y notificaciones

#### `Backend/apps/chat/routing.py`
Registra el consumer de chat:
```
ws/chat/<service_id>/
```

#### `Backend/apps/chat/consumers.py`
`ChatConsumer` — maneja el chat en tiempo real por servicio:
- Group: `chat_service_{service_id}`
- Al conectar: verifica que el usuario sea client, worker o admin del servicio
- Al conectar: marca mensajes no leídos como leídos (reemplaza la lógica que estaba en `views.py`)
- Recibe mensajes tipo `chat_message` → guarda en DB → broadcast al grupo
- Recibe mensajes tipo `mark_read` → marca mensajes del receptor como leídos

#### `Backend/apps/notifications/` ← app nueva
Nueva app Django con tres archivos:

**`consumers.py`** — `NotificationConsumer`:
- Group: `user_{user_id}`
- Solo recibe eventos del servidor (el cliente no envía nada)
- Eventos soportados: `service_update` (STATUS_CHANGE), `new_request_available` (SYSTEM_ALERT)

**`routing.py`**:
```
ws/notifications/
```

**`signals.py`** — escucha `post_save` de `ServiceRequest`:
- Cuando se **crea** una solicitud → broadcast a todas las operarias disponibles de esa categoría
- Cuando **cambia el estado** → notifica al cliente y a la operaria asignada
- Optimización: si `update_fields` no incluye `status`, no hace nada

**`apps.py`** — conecta las signals en `ready()`

#### `Backend/apps/users/migrations/0005_user_push_token.py`
Migración que agrega `push_token` al modelo `User` (preparado para push notifications futuras).

### Archivos modificados

#### `Backend/core/settings.py`
- `daphne` y `channels` agregados al inicio de `INSTALLED_APPS`
- `apps.notifications` agregado a `INSTALLED_APPS`
- `ASGI_APPLICATION = 'core.asgi.application'` — Django ahora usa ASGI
- `CHANNEL_LAYERS` con `InMemoryChannelLayer` para desarrollo

#### `Backend/requirements.txt`
Tres dependencias nuevas:
```
channels>=4.0.0
daphne>=4.0.0
channels-redis>=4.0.0
```

#### `Backend/apps/users/models.py`
Campo nuevo en `User`:
```python
push_token = models.CharField(max_length=200, blank=True, null=True)
```

#### `Backend/apps/users/views.py` + `urls.py`
Endpoint nuevo `POST /api/users/push-token/` — guarda el token de push del dispositivo (para uso futuro con development build).

---

## Frontend

### Nuevos archivos

#### `Fronted/hooks/useWebSocket.ts`
Hook central que gestiona cualquier conexión WebSocket. Características:
- `enabled` — conecta solo cuando es `true` (ej. solo cuando el modal está visible)
- Exponential backoff — reintenta con delays 1s, 2s, 4s... hasta 30s (máximo 10 intentos)
- `AppState` lifecycle — cierra el socket al ir a background, reconecta al volver a foreground
- No reintenta si el servidor devuelve código `4001` o `4003` (errores de auth/acceso)
- Expone `sendMessage(data)` para enviar desde el componente

#### `Fronted/hooks/useNotificationsWS.ts`
Hook que conecta al canal `ws/notifications/` y refresca React Query al recibir eventos:
- `STATUS_CHANGE` → invalida queries `service-requests` y `service-notifications`
- `SYSTEM_ALERT` → invalida las anteriores más las queries de admin
- Se conecta una sola vez a nivel de tab navigator (activo mientras el usuario navega)

#### `Fronted/hooks/usePushToken.ts`
Stub vacío por ahora — push notifications requieren development build con EAS.
Ver `push_notifications_pending.md` para instrucciones de activación.

### Archivos modificados

#### `Fronted/hooks/useChat.ts`
- **Eliminado** `refetchInterval: 3000` — el historial ya no se refresca cada 3 segundos
- Los mensajes nuevos llegan por WebSocket en tiempo real

#### `Fronted/hooks/useServices.ts`
- **Eliminado** `refetchInterval: 10000` de `useServiceRequests`
- **Eliminado** `refetchInterval: 15000` de `useServiceNotifications`
- Los dashboards se actualizan cuando llega un evento WS, no por tiempo

#### `Fronted/hooks/useAdmin.ts`
- **Eliminado** `refetchInterval: 15000` de `useAdminServices`
- **Eliminado** `refetchInterval: 10000` de `useAdminIncidents`

#### `Fronted/components/chat/ChatRoom.tsx`
- Conecta a `ws/chat/{serviceId}/?token=...` cuando el modal está visible
- Mensajes nuevos llegan por WS → invalida la query de React Query → re-render
- Al conectar envía `{ type: 'mark_read', service_id }` para marcar mensajes como leídos
- WS se desconecta automáticamente al cerrar el modal (`enabled: visible === true`)

#### `Fronted/app/(tabs)/index.tsx`
- Carga el token JWT con `getAccessToken()`
- Llama a `useNotificationsWS` a nivel de tab navigator — activo en todas las tabs
- Los dashboards reciben actualizaciones en tiempo real sin polling

#### `Fronted/app/_layout.tsx`
- Eliminado `import * as Notifications` — crasheaba en Expo Go SDK 53
- Agrega `usePushToken(!!user)` para registrar token cuando esté disponible

---

## Cambio en el servidor de desarrollo

Con `daphne` en `INSTALLED_APPS`, `runserver` ahora usa ASGI automáticamente:
```
Django version 6.0.2 → Starting ASGI/Daphne development server at http://...
```

Para que el dispositivo móvil pueda conectar, iniciar siempre con:
```bash
cd Backend
.venv/bin/python manage.py runserver 0.0.0.0:8000
```

---

## Qué mejoró

| Métrica | Antes | Después |
|---|---|---|
| Peticiones REST por minuto (chat activo) | ~20 (polling 3s) | 0 (push desde server) |
| Peticiones REST por minuto (dashboard) | 6–10 (polling 10-15s) | 0 (push desde server) |
| Latencia de actualización de estado | hasta 15s | < 1s |
| Latencia de mensajes nuevos en chat | hasta 3s | < 1s |

---

## Pendiente

- Push notifications en background → ver `push_notifications_pending.md`
- Redis como channel layer en producción (reemplaza `InMemoryChannelLayer`)
- Pruebas de carga y desconexiones en staging
