# Plan de Implementación: Seguimiento Geográfico en Vivo (Versión 100% Free)

Rastreo dinámico para que el cliente vea la ubicación de la operaria en tiempo real durante el trayecto, sin costos de API de Google Maps.

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
- Validar coordenadas en servidor (lat: -90..90, lng: -180..180)
- El servidor retransmite al grupo del cliente

### Almacenamiento
- **Redis**: cachear última ubicación conocida con TTL de 5 min (`tracking:service:{id}`)
- **No** insertar en PostgreSQL en cada update.

---

## 2. Frontend Operaria (Publicador)

### Librería
```bash
npx expo install expo-location expo-task-manager
```

### Captura de Ubicación
- Solo iniciar tracking si `serviceRequest.status === 'ON_WAY'`
- Detener al cambiar a `IN_PROGRESS` (ya llegó)
- Intervalo de envío: cada 30 segundos para balancear precisión y batería.

---

## 3. Frontend Cliente (Visualizador) — Estrategia "Zero Cost"

### Librería de mapas
```bash
npx expo install react-native-maps
```

### Configuración del Mapa (Sin API Key de Google)
En lugar de depender del SDK nativo de Google en Android:
- **iOS**: Usa Apple Maps por defecto (gratis e ilimitado).
- **Android**: Se usa el componente `<UrlTile />` con OpenStreetMap.

```tsx
import MapView, { UrlTile, Marker } from 'react-native-maps';

<MapView style={{ flex: 1 }}>
  {/* Capa de OpenStreetMap para Android */}
  {Platform.OS === 'android' && (
    <UrlTile 
      urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      maximumZ={19}
      flipY={false}
    />
  )}
  <Marker coordinate={workerLocation} title="Operaria Domy" />
</MapView>
```

### ETA y Distancia (Alternativa Gratuita)
En lugar de Google Distance Matrix:
1. **Fórmula Haversine**: Cálculo matemático en el cliente para distancia en línea recta.
2. **Factor de corrección**: `distancia_real ≈ haversine * 1.4` (estimación de calles).
3. **OSRM API (Opcional)**: Usar el servicio público de ruteo de OpenStreetMap para obtener el camino exacto.
   - Endpoint: `http://router.project-osrm.org/route/v1/driving/lng1,lat1;lng2,lat2`

---

## 4. Privacidad y Consentimiento

- Al activar `ON_WAY`, mostrar alerta a la operaria: `"Tu ubicación será compartida con el cliente durante el trayecto"`.
- Al completar servicio (`IN_PROGRESS`), confirmar que tracking se detuvo.

---

## 5. Plan de Acción

| Paso | Tarea | Bloqueante |
|------|-------|------------|
| 1 | Agregar estado `ON_WAY` + migración | Ninguno |
| 2 | `TrackingConsumer` + routing WS | Django Channels activo |
| 3 | `expo-location` en app operaria | Paso 1 |
| 4 | Mapa con `UrlTile` (OSM) en cliente | Paso 2 |
| 5 | Implementar `ETA` con Haversine (JS local) | Paso 4 |
