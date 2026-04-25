# Plan de Implementación: Refinamiento de UX y Fidelización

Mejoras enfocadas en retención del cliente y agilidad en la solicitud.

---

## Estado Actual

- Solicitudes de servicio usan dirección de texto libre (sin múltiples direcciones guardadas)
- No hay sistema de favoritos
- Historial sin filtros avanzados
- `ServiceRequest` no tiene campo `latitude`/`longitude` — solo texto de dirección

---

## 1. Gestión de Múltiples Direcciones

### Backend — Modelo nuevo
```python
# apps/users/models.py (o apps/users/models_address.py)
class UserAddress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='addresses'
    )
    alias = models.CharField(max_length=50)  # "Casa", "Oficina", etc.
    address_line = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_default = models.BooleanField(default=False)

    class Meta:
        constraints = [
            # Solo una dirección default por usuario
            models.UniqueConstraint(
                fields=['user'],
                condition=models.Q(is_default=True),
                name='unique_default_address_per_user'
            )
        ]
```
**Migración requerida.**

### Geocodificación
- Al guardar una `UserAddress`, el frontend puede enviar lat/lng directamente desde `expo-location` (si el usuario selecciona en mapa) o dejar null
- Alternativa: Google Geocoding API en backend para convertir texto → coords (requiere API key con billing)
- Para MVP: lat/lng opcionales, dirección de texto obligatoria

### Endpoints
```
GET    /api/users/addresses/         → listar mis direcciones
POST   /api/users/addresses/         → crear dirección
PATCH  /api/users/addresses/{id}/    → editar / cambiar default
DELETE /api/users/addresses/{id}/    → eliminar
```

### Frontend
- En el modal de solicitud de servicio, mostrar lista **"Mis Direcciones"** antes del campo de texto libre
- Botón **"+ Nueva dirección"** → abre selección en mapa o entrada manual
- Al seleccionar dirección default, pre-completar el campo en el modal

---

## 2. Sistema de Operarias Favoritas

### Backend — Modelo nuevo
```python
# apps/users/models.py
class FavoriteWorker(models.Model):
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorites'
    )
    worker = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('client', 'worker')
```
**Migración requerida.**

### Lógica de negocio
- Trigger: al completar y calificar un servicio, mostrar botón `"¿Añadir a {Nombre} a tus favoritas?"` (no solo con 5 estrellas — umbral configurable, default ≥ 4)
- Al crear nuevo servicio, modificar lógica de broadcast en `services/views.py`: notificar primero a operarias favoritas del cliente, esperar 2 min, luego notificar al pool general

### Frontend
```ts
interface FavoriteWorker {
    worker_id: number;
    name: string;
    avatar_url: string;
    avg_rating: number;
}
```
- Sección **"Mis Favoritas"** en perfil del cliente
- Indicador visual en el modal de solicitud si hay favoritas disponibles

---

## 3. Filtros y Búsqueda Avanzada en Historial

### Backend — Parámetros de query en endpoint existente
```
GET /api/services/requests/?start_date=2025-01-01&end_date=2025-12-31&category=1&worker_id=5
```
- Agregar `django-filter` o filtrado manual en `ServiceRequestViewSet`
- Solo devolver resultados del usuario autenticado (ya existe)

### Frontend
- Componente `FilterSheet` (bottom sheet) con:
  - Rango de fechas (DatePicker)
  - Categoría (Picker/Select)
  - Operaria (búsqueda por nombre)
- Integrar en pantalla de historial de servicios

---

## 4. Plan de Acción

| Fase | Tarea | Bloqueante |
|------|-------|------------|
| 1 | Modelo `UserAddress` + endpoints + migración | Ninguno |
| 2 | UI selección de dirección en modal de solicitud | Fase 1 |
| 3 | Modelo `FavoriteWorker` + migración | Ninguno |
| 4 | UI botón "Añadir a favoritas" tras calificar | Fase 3 |
| 5 | Modificar broadcast para priorizar favoritas | Fase 3 |
| 6 | Filtros en historial (backend + frontend) | Ninguno |
