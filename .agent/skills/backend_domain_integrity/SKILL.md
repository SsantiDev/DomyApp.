---
name: "backend_domain_integrity"
description: "domain modeling and transaction integrity guide for domy using django and postgresql. use when designing or reviewing models, services, constraints, migrations, transaction boundaries, rollback safety, and multi-entity domain operations."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Domain Integrity
fecha_actualizacion: 2026-03-08
tags: [django, postgresql, domain-modeling, transactions, migrations, constraints, integrity]
---
# Backend Domain Integrity

## Propósito
Esta skill define el estándar para modelado de dominio, integridad transaccional y seguridad estructural de datos en Domy.

## Cuándo aplicar esta skill
- creación o modificación de modelos
- cambios en relaciones, constraints o managers
- diseño de lógica de negocio multi-entidad
- operaciones que afectan varias tablas
- migraciones con impacto en datos
- revisión de atomicidad, rollback o idempotencia

## Flujo del agente
1. Identificar entidades, relaciones y reglas de negocio involucradas.
2. Definir qué parte debe resolverse en modelo, service o constraint.
3. Verificar atomicidad y consistencia ante fallo parcial.
4. Revisar impacto en migraciones y datos existentes.
5. Proponer implementación y pruebas de integridad.

## Reglas obligatorias

### Modelado
- usar nombres explícitos y relaciones claras
- modelar restricciones del negocio con constraints reales cuando aplique
- evitar que la integridad dependa solo del frontend o del serializer
- usar custom QuerySets o managers para filtros reutilizables

### Transacciones
- usar `transaction.atomic` en operaciones multi-entidad
- definir límites transaccionales explícitos
- validar rollback coherente ante fallos intermedios
- evaluar idempotencia en operaciones sensibles o repetibles

### Services
- mover lógica de negocio compleja a `services.py` o capa equivalente
- mantener views y serializers fuera de reglas de dominio complejas
- diseñar servicios reutilizables y testeables

### Migraciones
- preferir migraciones seguras, reversibles y explícitas
- evaluar impacto en volumen de datos antes de alterar tablas grandes
- no mezclar cambios estructurales riesgosos sin plan claro
- revisar defaults, nullability y backfills con cuidado

## Anti-patrones prohibidos
- lógica crítica distribuida arbitrariamente entre serializer y view
- reglas de negocio sin respaldo en base de datos cuando deberían tenerlo
- migraciones destructivas sin análisis
- operaciones multi-tabla sin atomicidad
- modelos ambiguos o con responsabilidades difusas

## Lógica de decisión

### Si el cambio afecta varias tablas
- envolver en `transaction.atomic`
- definir orden de escritura y rollback esperado

### Si la regla es crítica para integridad
- llevarla también a constraint o validación estructural cuando sea posible

### Si la operación puede repetirse
- revisar idempotencia y duplicados

### Si la migración toca datos en producción
- revisar estrategia de compatibilidad, backfill y reversión

## Contrato de salida
1. objetivo de dominio
2. entidades y relaciones afectadas
3. mutaciones estructurales o constraints
4. estrategia transaccional
5. riesgos de migración o consistencia
6. tests requeridos
7. recomendación final

## Formato de respuesta esperado

### Resumen
Qué parte del dominio cambia.

### Diseño de dominio
Modelos, relaciones, services o constraints propuestos.

### Integridad transaccional
Cómo se garantiza atomicidad, rollback e idempotencia.

### Migraciones
Qué cambia en esquema y qué riesgos existen.

### Testing
Qué pruebas protegen integridad y regresiones.

### Recomendación final
La implementación más segura y consistente con Domy.