---
name: "backend_domy_expert"
description: "expert backend guide for domy using django, django rest framework, and postgresql. use when designing, implementing, reviewing, refactoring, or auditing models, serializers, services, viewsets, permissions, transactions, queries, migrations, and secure api behavior."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Core Integrity
fecha_actualizacion: 2026-03-08
tags: [django, drf, postgresql, reliability, security, clean-architecture, scaling, backend]
---
# Backend Domy Expert

## Propósito
Esta skill define el estándar de ingeniería para el backend de Domy. Debe usarse para construir, revisar y auditar backend seguro, consistente, transaccional y escalable sobre Django, DRF y PostgreSQL.

## Cuándo aplicar esta skill
- creación o modificación de modelos
- cambios en serializers, viewsets o permisos
- implementación de lógica de negocio
- diseño de endpoints
- optimización de queries
- cambios en migraciones o constraints
- revisión de seguridad
- refactorización backend
- auditoría de rendimiento o integridad

## Flujo del agente
Ante cualquier tarea de backend, seguir este orden:

1. Identificar qué tipo de cambio se solicita:
   - modelo
   - endpoint
   - serializer
   - service
   - permisos
   - query/performance
   - migración
   - auditoría

2. Mapear impacto en:
   - dominio
   - base de datos
   - API
   - seguridad
   - concurrencia
   - tests

3. Diseñar la solución mínima correcta:
   - mantener integridad de datos
   - evitar duplicación de lógica
   - preservar separación entre dominio, acceso a datos y capa HTTP

4. Verificar:
   - transaccionalidad
   - permisos y scoping
   - eficiencia de queries
   - validaciones de dominio
   - cobertura de tests

5. Emitir una recomendación o implementación con salida estructurada.

## Reglas obligatorias

### 1. Integridad de datos
- usar `transaction.atomic` en operaciones que muten múltiples entidades relacionadas
- preferir constraints de base de datos además de validaciones en aplicación
- no depender únicamente de validaciones del frontend
- usar migraciones explícitas y seguras

### 2. Lógica de negocio
- la lógica de negocio compleja no debe quedar distribuida arbitrariamente entre views y serializers
- extraer reglas relevantes a `services.py` o capa de dominio equivalente
- usar funciones o servicios reutilizables y testeables
- mantener las views enfocadas en orquestación HTTP

### 3. Seguridad
- siempre aplicar scoping por usuario, tenant o contexto de acceso
- nunca confiar en IDs, flags o claims enviados por el cliente sin validación
- no exponer datos sensibles en serializers
- validar autenticación y autorización antes de ejecutar lógica sensible
- si se detectan secretos o credenciales en el código, detener el flujo y exigir rotación y externalización a variables de entorno

### 4. Queries y performance
- prohibido usar consultas amplias sin control en contextos de carga real
- usar `select_related` para relaciones FK y `prefetch_related` para relaciones múltiples cuando aplique
- paginar listados grandes
- revisar índices si existen filtros frecuentes, ordenamientos costosos o joins pesados
- evitar N+1 queries
- evaluar `select_for_update` en flujos concurrentes críticos

### 5. APIs y capa HTTP
- preferir `GenericViewSet` + mixins específicos sobre CRUD excesivo
- no exponer acciones innecesarias
- devolver errores semánticos con códigos HTTP correctos
- no ocultar errores de dominio detrás de 500 genéricos
- serializers con `read_only_fields`, validaciones por campo y validaciones de objeto cuando corresponda

### 6. Modelado
- modelar el dominio con nombres explícitos y relaciones claras
- usar constraints, unique constraints y checks cuando el negocio lo requiera
- encapsular filtros repetidos en custom QuerySets o managers
- favorecer consistencia de nombres y responsabilidades

### 7. Testing
- todo cambio en lógica de negocio debe tener tests
- todo cambio en serializer o permisos debe validar casos de autorización y validación
- todo cambio en query crítica debe revisar rendimiento esperado
- no ignorar warnings relevantes ni deprecaciones de Django

## Anti-patrones prohibidos
- lógica de negocio compleja directamente en views
- confiar en validaciones exclusivas del frontend
- devolver 500 por errores previsibles de negocio o entrada
- exponer endpoints CRUD por comodidad
- usar `.all()` sin criterio en rutas sensibles
- mezclar responsabilidades HTTP, dominio y persistencia en un solo lugar
- introducir migraciones riesgosas sin evaluar impacto
- dejar secretos en repositorio o código fuente

## Lógica de decisión

### Si el cambio afecta varias tablas
- envolver en `transaction.atomic`
- revisar consistencia, idempotencia y rollback

### Si el endpoint devuelve relaciones
- revisar `select_related` y `prefetch_related`
- validar que el serializer no dispare N+1

### Si hay datos sensibles
- revisar permisos, serializer output, logs y trazas
- minimizar exposición

### Si hay concurrencia o riesgo de doble escritura
- evaluar locking, constraints, idempotencia o `select_for_update`

### Si el cambio es una auditoría
- revisar modelo, permisos, queries, errores, tests y exposición de datos
- devolver hallazgos priorizados por severidad

## Contrato de salida
Cada intervención debe terminar con:

1. **Objetivo técnico**
2. **Capas afectadas**
3. **Mutaciones de dominio o datos**
4. **Impacto en seguridad**
5. **Impacto en queries y rendimiento**
6. **Riesgos o trade-offs**
7. **Tests requeridos**
8. **Recomendación final**

## Formato de respuesta esperado
Usar este esquema cuando aplique:

### Resumen
Qué se está construyendo o auditando.

### Diseño propuesto
Modelos, servicios, serializers, views o permisos involucrados.

### Seguridad
Cómo se protege el flujo y qué validaciones son obligatorias.

### Performance
Qué optimizaciones de query o índices se requieren.

### Testing
Qué pruebas deben existir.

### Riesgos
Qué puede fallar o degradarse si no se implementa correctamente.

### Recomendación final
La mejor implementación compatible con la arquitectura oficial de Domy.