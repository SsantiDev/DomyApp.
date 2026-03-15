# API guidelines — Domy en Mobil

## Objetivo
Definir lineamientos para diseñar endpoints y contratos API alineados con Django REST Framework y con la arquitectura oficial de Domy en Mobil.

## Principios
- Los endpoints deben ser explícitos.
- La API debe ser segura, consistente y versionable.
- La lógica crítica no debe diluirse en contratos ambiguos.
- Las respuestas deben ser predecibles para facilitar integración móvil.
- Toda decisión de contrato debe priorizar claridad, mantenibilidad y compatibilidad con clientes móviles.

## Versionado

### Regla
Usar versionado explícito en rutas.

### Convención
- `/api/v1/...`

### Criterios
- Mantener compatibilidad razonable dentro de una misma versión.
- Introducir una nueva versión cuando existan cambios incompatibles de contrato.
- Evitar cambios silenciosos que rompan clientes móviles ya desplegados.

---

# Diseño de endpoints

## Reglas generales
- usar nombres claros y orientados a recursos
- usar acciones explícitas solo cuando representen transiciones de negocio justificadas
- evitar endpoints genéricos con múltiples comportamientos implícitos
- evitar sobrecargar un solo endpoint con demasiadas responsabilidades
- modelar acciones sensibles como operaciones de negocio explícitas
- mantener consistencia de naming entre módulos
- evitar rutas ambiguas o semánticamente débiles

## Convenciones recomendadas
- usar sustantivos en plural para colecciones
- usar identificadores estables para recursos
- mantener jerarquías simples y comprensibles
- separar autenticación de recursos de negocio
- reflejar claramente cuándo una ruta representa lectura, creación, actualización o transición de estado

## Ejemplos recomendados
- `GET /api/v1/services/`
- `GET /api/v1/services/{id}/`
- `POST /api/v1/bookings/`
- `GET /api/v1/bookings/{id}/`
- `PATCH /api/v1/bookings/{id}/`
- `POST /api/v1/bookings/{id}/cancel/`
- `POST /api/v1/auth/login/`
- `POST /api/v1/auth/refresh/`
- `POST /api/v1/auth/logout/`

## Anti-patrones
- `/api/do-everything/`
- endpoints que cambian comportamiento según demasiados flags
- acciones críticas escondidas dentro de `PATCH` genéricos sin semántica clara
- rutas inconsistentes entre módulos similares
- endpoints que mezclan lectura, cálculo y escritura sin separación clara

---

# Métodos HTTP

## GET
Usar para lectura de recursos sin efectos secundarios.

## POST
Usar para creación de recursos o ejecución de acciones de negocio explícitas.

## PATCH
Usar para actualizaciones parciales y controladas.

## PUT
Usar solo si existe un caso real de reemplazo completo del recurso.

## DELETE
Usar cuando el dominio permita borrado real o lógico claramente definido.

## Regla
No usar métodos HTTP de forma semánticamente incorrecta por conveniencia de implementación.

---

# Contratos de request

## Reglas
- aceptar solo campos necesarios
- validar tipos, formatos y obligatoriedad
- rechazar campos inesperados cuando comprometan claridad o seguridad
- evitar payloads ambiguos
- mantener consistencia entre endpoints similares

## Recomendación
Definir payloads de entrada pequeños, explícitos y estables.

## Ejemplo

```json
{
  "service_id": 12,
  "scheduled_at": "2026-03-15T10:30:00Z",
  "address_id": 8,
  "notes": "Llamar al llegar"
}
```

---

# Contratos de respuesta

## Principios
- devolver solo la información necesaria
- mantener estructura consistente
- facilitar parsing desde cliente móvil
- evitar variaciones innecesarias entre endpoints equivalentes

## Respuesta exitosa

```json
{
  "id": 142,
  "status": "confirmed",
  "scheduled_at": "2026-03-15T10:30:00Z"
}
```

## Respuesta de colección

```json
{
  "count": 120,
  "next": "/api/v1/services/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Plomería"
    }
  ]
}
```

## Respuesta de error

```json
{
  "code": "booking_conflict",
  "message": "The selected time slot is no longer available.",
  "details": {
    "slot": "2026-03-15T10:30:00Z"
  }
}
```

---

# Errores y manejo de fallos

## Reglas
- usar códigos HTTP coherentes con el tipo de error
- separar errores de validación, autenticación, autorización, conflicto y fallo interno
- devolver mensajes comprensibles para cliente y observabilidad
- no filtrar información sensible o interna en errores

## Criterios mínimos
- `400` para request inválido
- `401` para autenticación faltante o inválida
- `403` para falta de permisos
- `404` para recurso inexistente o no accesible según política
- `409` para conflictos de estado o concurrencia
- `422` solo si el proyecto decide diferenciar validación semántica
- `500` para errores internos no controlados

## Regla adicional
Los mensajes de error deben ser útiles para frontend, pero no deben exponer detalles internos del sistema.

---

# Autenticación

## Regla
Usar JWT para endpoints protegidos.

## Criterios
- exigir autenticación en toda operación sensible
- separar claramente login, refresh y logout
- no devolver información sensible innecesaria en respuestas autenticadas
- manejar expiración de access token de forma predecible
- permitir renovación controlada con refresh token según política del proyecto

## Endpoints típicos
- `POST /api/v1/auth/login/`
- `POST /api/v1/auth/refresh/`
- `POST /api/v1/auth/logout/`

---

# Autorización

## Regla
La autorización debe resolverse en backend según:

- rol
- ownership del recurso
- contexto de negocio
- estado del recurso
- permisos específicos de la acción

## Recomendación
No asumir que un usuario autenticado puede operar cualquier recurso relacionado.

---

# Validación

## Regla
La API debe validar payloads de entrada y reglas de negocio críticas.

## Ubicación recomendada
- serializers para validación estructural
- services o capa de dominio para reglas de negocio complejas
- permissions para control de acceso
- validación transaccional donde la integridad lo requiera

## Regla crítica
No confiar en validaciones del cliente como protección suficiente.

---

# Paginación

## Regla
Todo listado que pueda crecer debe ser paginable.

## Recomendaciones
- incluir `count`, `next`, `previous` y `results`
- mantener tamaño de página razonable para cliente móvil
- evitar respuestas masivas que degraden rendimiento o UX

## Ejemplo

```json
{
  "count": 120,
  "next": "/api/v1/services/?page=2",
  "previous": null,
  "results": []
}
```

---

# Filtrado y ordenamiento

## Reglas
- permitir filtros solo cuando aporten valor real
- exponer ordenamiento de manera controlada
- evitar combinaciones arbitrarias que compliquen seguridad o rendimiento
- documentar filtros soportados de manera consistente

## Recomendaciones
- filtrar por estado, fecha, categoría o ownership cuando aplique
- limitar campos ordenables a los necesarios

---

# Idempotencia

## Aplicar cuando
- pueda haber reintentos por red
- la app funcione con colas offline
- una repetición accidental genere efectos dobles
- el dominio incluya confirmaciones, reservas o creaciones sensibles

## Recomendaciones
- proteger contra duplicados lógicos
- considerar claves de idempotencia si el flujo lo requiere
- diseñar acciones de reintento seguro cuando haya sincronización offline

---

# Manejo de estados

## Regla
No permitir transiciones inválidas desde el cliente.

## Criterios
- toda transición crítica debe validarse en backend
- el cliente puede solicitar una acción, pero no imponer el estado final
- las transiciones deben respetar reglas de dominio y permisos

## Ejemplos
- `POST /api/v1/bookings/{id}/confirm/`
- `POST /api/v1/bookings/{id}/cancel/`
- `POST /api/v1/bookings/{id}/complete/`

---

# Consistencia con mobile y offline-first

## Reglas
- diseñar respuestas fáciles de cachear y sincronizar
- usar identificadores estables
- incluir timestamps cuando aporten valor para reconciliación
- evitar contratos excesivamente anidados si dificultan persistencia local
- considerar conflictos de sincronización y reintentos en operaciones sensibles

---

# Rendimiento

## Reglas
- evitar overfetching innecesario
- evitar underfetching que fuerce múltiples llamadas evitables
- paginar colecciones grandes
- filtrar y seleccionar datos con intención clara
- optimizar serialización en recursos de alto uso

---

# Observabilidad y trazabilidad

## Reglas
- registrar errores relevantes sin exponer secretos
- mantener consistencia entre códigos de error y eventos registrados
- facilitar diagnóstico de fallos de integración

---

# Recomendaciones específicas para Django REST Framework

## Preferir
- serializers para input y output
- viewsets o views enfocadas por responsabilidad
- permissions explícitos
- services para lógica compleja
- transacciones cuando una operación deba ser atómica

## Evitar
- lógica compleja concentrada solo en views
- serializers con demasiada responsabilidad de negocio
- endpoints excesivamente mágicos o difíciles de testear
- duplicación de reglas entre vistas y cliente

---

# Checklist de calidad para nuevos endpoints

Antes de proponer o aprobar un endpoint verificar:

- si el nombre es claro
- si la semántica HTTP es correcta
- si la autenticación y autorización están definidas
- si la validación crítica vive en backend
- si la respuesta es consistente con el resto de la API
- si el endpoint soporta bien clientes móviles
- si el flujo tolera reintentos o conflictos cuando aplique
- si existe riesgo de sobrecargar el contrato
- si la transición de estado está claramente modelada

---

# Regla final

Toda API propuesta por la skill debe ser:

- explícita  
- segura  
- versionable  
- coherente con offline-first  
- fácil de consumir desde React Native  
- mantenible en Django REST Framework