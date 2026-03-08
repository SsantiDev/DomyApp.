---
name: "backend_query_performance"
description: "query and performance optimization guide for domy using django orm and postgresql. use when reviewing list endpoints, joins, related loading, pagination, indexing, locking, slow queries, and n+1 risks."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Performance
fecha_actualizacion: 2026-03-08
tags: [django, postgresql, performance, queries, indexing, pagination, orm, n+1]
---
# Backend Query Performance

## Propósito
Esta skill define el estándar para rendimiento de consultas y eficiencia de acceso a datos en Domy, usando Django ORM y PostgreSQL.

## Cuándo aplicar esta skill
- endpoints lentos
- listados con relaciones
- riesgo o presencia de N+1
- revisión de `select_related` o `prefetch_related`
- necesidad de paginación o índices
- joins complejos
- timeouts, locks o consultas costosas
- tuning de acceso a datos

## Flujo del agente
1. Identificar patrón de acceso a datos.
2. Revisar relaciones cargadas, cardinalidad y volumen.
3. Detectar N+1, filtros costosos o sobrelectura.
4. Proponer optimización ORM y/o de base de datos.
5. Validar impacto en memoria, latencia y consistencia.

## Reglas obligatorias

### Carga relacionada
- usar `select_related` para FK y one-to-one cuando se lean relaciones inmediatas
- usar `prefetch_related` para relaciones múltiples cuando aplique
- revisar que serializer y queryset estén alineados

### Listados
- paginar listados grandes
- no usar consultas amplias sin control en rutas de alto tráfico
- devolver solo los campos necesarios cuando sea razonable

### Índices y filtros
- revisar índices ante filtros frecuentes, ordenamientos recurrentes o joins costosos
- no asumir que ORM correcto implica performance suficiente
- evaluar explain plans cuando el caso lo requiera

### Concurrencia
- evaluar `select_for_update` en flujos críticos de escritura concurrente
- revisar lock contention en operaciones sensibles
- balancear locking con throughput

## Anti-patrones prohibidos
- N+1 sin detectar
- `.all()` sin control en endpoints críticos
- listados sin paginación
- joins innecesarios
- serializers que fuerzan cargas implícitas costosas
- optimización ciega sin entender patrón de acceso

## Lógica de decisión

### Si el serializer toca relaciones
- revisar si el queryset las precarga correctamente

### Si el endpoint lista muchas filas
- paginar
- limitar columnas o relaciones
- revisar índices

### Si hay timeout o lentitud
- inspeccionar filtros, joins, ordenamientos y locking

### Si hay alta concurrencia
- evaluar locking explícito y costo asociado

## Contrato de salida
1. patrón de acceso revisado
2. problema principal detectado
3. optimización propuesta
4. impacto estimado en queries
5. riesgos de memoria, locking o complejidad
6. validaciones o mediciones sugeridas
7. recomendación final

## Formato de respuesta esperado

### Resumen
Qué flujo o endpoint presenta el problema.

### Diagnóstico
Dónde está el costo: relaciones, volumen, filtros, joins o locking.

### Optimización propuesta
Qué cambiar en queryset, serializer, paginación o índices.

### Riesgos
Qué trade-offs introduce la optimización.

### Validación
Qué medir o probar después del cambio.

### Recomendación final
La mejora más razonable para Domy.