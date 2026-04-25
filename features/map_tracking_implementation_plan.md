# Plan de Implementación: Seguimiento Geográfico en Vivo

Rastreo dinámico para que el cliente vea la ubicación de la operaria en tiempo real durante el trayecto.

---

## Estado Actual

- Mapas en `service-detail/[id].tsx` son estáticos (solo muestran dirección)
- No existe estado `ON_WAY` en `ServiceRequest`
- Depende de que Django Channels esté implementado (ver `real_time_communication_plan.md`)

---

## 1. Backend

### Nuevo estado en `ServiceRequest`
```python
# apps/services/models.py — agregar a Status choices
ON_WAY = 'ON_WAY', 'En camino'
```
Flujo: `ACCEPTED → ON_WAY → IN_PROGRESS → COMPLETED`
**Migración requerida.**

### Consumer (`apps/services/consumers.py`)
- **`TrackingConsumer`**
- Group name: `service_tracking_{service_id}`
- La operaria envía: `{"type": "location_update", "lat": 1.23, "lng": -4.56}`
- Validar coordenadas en servidor (lat: -90..90, lng: -180..180) — rechazar valores fuera de rango
- El servidor retransmite al grupo del cliente
- Autorización: solo el `worker` asignado al servicio puede publicar coordenadas

### Almacenamiento
- **Redis**: cachear última ubicación conocida con TTL de 5 min (`tracking:service:{id}`)
- **Modelo opcional** `WorkerPathLog` para auditoría post-servicio (no crítico para MVP)
- **No** insertar en PostgreSQL en cada update — demasiado costoso a 30s de intervalo

### Channel Layer
Mismo Redis de `real_time_communication_plan.md` — no se necesita infraestructura adicional.

---

## 2. Frontend Operaria (Publicador)

### Librería
```bash
npx expo install expo-location expo-task-manager
```

### Permisos requeridos
- **Android**: `ACCESS_FINE_LOCATION` + `ACCESS_BACKGROUND_LOCATION` en `app.json`
- **iOS**: `NSLocationAlwaysAndWhenInUseUsageDescription` en `app.json`
- **Nota**: los permisos de background son restrictivos en tiendas. Alternativa más simple: solo capturar cuando app en foreground (suficiente para MVP).

### Tarea en segundo plano
```ts
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK = 'DOMY_TRACKING';

TaskManager.defineTask(LOCATION_TASK, ({ data, error }) => {
    if (error || !data) return;
    const { locations } = data as any;
    // Enviar via WS solo si servicio en estado ON_WAY
    sendLocationUpdate(locations[0].coords);
});
```

### Condición de activación
- Solo iniciar tracking si `serviceRequest.status === 'ON_WAY'`
- Detener al cambiar a `IN_PROGRESS` (ya llegó)
- Limpiar tarea al desmontar o cerrar servicio

### Envío adaptativo (batería)
- Enviar coordenada cada 30 s si velocidad > 2 m/s
- Enviar cada 60 s si velocidad ≤ 2 m/s (detenida en tráfico)
- Usar `heading` de `expo-location` para rotar el marcador

---

## 3. Frontend Cliente (Visualizador)

### Librería de mapas
```bash
npx expo install react-native-maps
```
Requiere configurar API Key de Google Maps en `app.json` (Android) y en `AppDelegate` (iOS).

### Hook `useLiveTracking`
```ts
interface LocationUpdate {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
}

const { workerLocation, eta } = useLiveTracking(serviceId);
// Conectar WS a ws/tracking/{serviceId}/?token=...
// Solo si servicio.status === 'ON_WAY'
```

### Componente mapa
- `MapMarker` con icono "Domy" animado usando `Animated.Value` para suavizar movimiento entre coordenadas
- Mostrar también marcador del domicilio del cliente
- Centrar cámara automáticamente entre ambos puntos

### ETA dinámico
- API: **Google Distance Matrix** — requiere API key con billing habilitado
- Costo: ~$5 USD por 1000 elementos. Para MVP considerar estimación local (distancia Haversine ÷ velocidad promedio).
- Mostrar: `"La operaria está a ~5 min"` actualizado cada vez que llega nueva coordenada

---

## 4. Privacidad y Consentimiento

- Al activar `ON_WAY`, mostrar alerta a la operaria: `"Tu ubicación será compartida con el cliente durante el trayecto"`
- Al completar servicio (`IN_PROGRESS`), confirmar que tracking se detuvo
- No almacenar coordenadas indefinidamente — `WorkerPathLog` con retención de 30 días máximo

---

## 5. Plan de Acción

| Paso | Tarea | Bloqueante |
|------|-------|------------|
| 1 | Agregar estado `ON_WAY` + migración | Ninguno |
| 2 | `TrackingConsumer` + routing WS | Django Channels activo |
| 3 | `expo-location` + tarea background en app operaria | Paso 1 |
| 4 | `useLiveTracking` + mapa animado en cliente | Paso 2 |
| 5 | Integrar ETA (Haversine primero, Google Matrix después) | Paso 4 |
