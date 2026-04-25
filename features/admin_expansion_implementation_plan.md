# Plan de Implementación: Evolución del Panel Admin

Expansión del dashboard administrativo con métricas financieras, gestión de disputas y análisis de operación.

---

## Estado Actual

- `AdminDashboard.tsx` y `AdminServiceDetails.tsx` existen con funcionalidad básica
- Admin ya puede leer ambos chats (coordinación y soporte) — **ya implementado**
- `Incident` model existe en `apps/support` con estados `OPEN`, `IN_REVIEW`, `RESOLVED`
- No hay módulo de pagos implementado — módulo `payments` está vacío

---

## 1. Módulo Financiero

### Backend — Endpoint de resumen
```
GET /api/admin/finance/summary/
```
- **Permiso**: `IsAdminUser` (no `IsAuthenticated` genérico)
- **Respuesta**:
```json
{
    "total_revenue": 0,
    "platform_commissions": 0,
    "pending_payouts": 0,
    "period": "monthly"
}
```
**Nota crítica**: sin módulo de pagos implementado, estos valores serán 0 o estimados. Este endpoint es un placeholder hasta integrar pasarela. El campo `price` debe existir en `ServiceRequest` para calcular `total_revenue`.

### Constantes de negocio (en `settings.py`, no hardcodeadas)
```python
PLATFORM_FEE_PERCENTAGE = env.float('PLATFORM_FEE_PERCENTAGE', default=0.20)
TAX_RETENTION_PERCENTAGE = env.float('TAX_RETENTION_PERCENTAGE', default=0.05)
```

### Frontend
- Integrar `react-native-gifted-charts` (más mantenida que `react-native-chart-kit`)
- Requiere `react-native-svg` como peer dependency
- Gráficas: ingresos mensuales (línea), distribución por categoría (torta)

```ts
type AdminMetric = {
    label: string;
    value: number | string;
    trend: 'up' | 'down' | 'neutral';
}
```

---

## 2. Gestión de Disputas (Soporte Nivel 2)

### Estado `Incident` — corrección
El plan original tenía `ESCORTED` (error tipográfico). Estado correcto:
```python
class Status(models.TextChoices):
    OPEN = 'OPEN'
    IN_REVIEW = 'IN_REVIEW'
    ESCALATED = 'ESCALATED'   # ← era ESCORTED (typo)
    RESOLVED = 'RESOLVED'
```
**Migración requerida** si se agrega `ESCALATED`.

### Acciones Admin
- **Refund**: botón que setea flag `needs_refund=True` en `Incident` — ejecución real bloqueada hasta implementar pasarela de pagos
- **Penalty**: endpoint `POST /api/admin/workers/{id}/penalty/` que aplica deducción manual al promedio de calificaciones. Debe registrar en log quién aplicó la penalidad y por qué (campo `penalty_reason`)
- **Escalate**: mover incidente a `ESCALATED` con nota interna

### UI Admin
- Pestaña **"Incidentes Activos"** en `AdminDashboard`
- Chat tripartito: ya funciona — Admin ve coordinación + soporte en `ChatRoom.tsx`
- Agregar botón **"Abrir Chat del Servicio"** desde la pantalla de detalle de incidente

---

## 3. Métricas de Operación

### Tasa de Cancelación / Rechazo
```
GET /api/admin/metrics/workers/rejection-rate/
```
- Operarias que rechazan >X servicios asignados en los últimos 30 días
- Umbral configurable en settings

### Heatmaps de demanda
- **Dependencia**: requiere campo `latitude`/`longitude` en `ServiceRequest` (dirección del servicio)
- Librería: `react-native-maps` con `Heatmap` component (disponible en la misma lib del tracking)
- Datos: agrupar servicios por coordenadas aproximadas (grid de ~500m)
- **Prioridad baja** — depende de tracking geográfico implementado

---

## 4. Historial de Pagos a Operarias

Modelo nuevo (bloqueado hasta implementar pagos):
```python
# apps/payments/models.py
class WorkerPayout(models.Model):
    worker = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    period_start = models.DateField()
    period_end = models.DateField()
    paid_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(choices=[('PENDING','Pending'),('PAID','Paid')])
```

---

## 5. Plan de Acción

| Fase | Tarea | Bloqueante |
|------|-------|------------|
| 1 | Corregir typo `ESCALATED` + migración | Ninguno |
| 2 | Endpoint `/finance/summary/` (valores estimados) | Ninguno |
| 3 | UI métricas con `react-native-gifted-charts` | Fase 2 |
| 4 | Acciones Penalty + Escalate en UI | Fase 1 |
| 5 | Refund real + `WorkerPayout` | Pasarela de pagos |
| 6 | Heatmaps | Tracking geográfico activo |
