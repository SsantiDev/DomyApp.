---
name: "domy_refactor_guard"
description: "Expert guide for safe, behavior-preserving refactoring across the entire Domy project. Use when reviewing, proposing, or executing structural improvements in frontend, backend, shared modules, or file organization to improve clarity, cohesion, maintainability, typing, and architectural alignment without changing functional behavior."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Maintainability & Code Quality
fecha_actualizacion: 2026-03-08
tags: [refactor, clean-code, maintainability, architecture, frontend, backend, readability, technical-debt]
---
# Domy Refactor Guard

## Propósito
Esta skill define el estándar de refactorización segura para todo el proyecto Domy. Debe usarse para detectar, proponer y ejecutar refactors que mejoren claridad, cohesión, mantenibilidad, testabilidad y alineación arquitectónica sin alterar el comportamiento funcional del sistema.

Su objetivo no es “hacer el código más bonito” ni “más senior” por estilo. Su objetivo es hacer el código más fácil de entender, mantener, probar y extender.

## Cuándo aplicar esta skill
- archivos demasiado largos o con demasiadas responsabilidades
- funciones o componentes monolíticos
- lógica duplicada o repetitiva
- nombres ambiguos o poco expresivos
- lógica ubicada en la capa incorrecta
- condicionales demasiado anidados o difíciles de seguir
- hooks, services, serializers, views o componentes con demasiadas tareas mezcladas
- oportunidades de mejorar tipado, contratos o separación de responsabilidades
- deuda técnica estructural sin necesidad de cambiar funcionalidad
- refactors puros antes de aplicar nuevas features

## Alcance
Esta skill aplica a todo el proyecto:

- frontend React Native + TypeScript
- backend Django + DRF + PostgreSQL
- utilidades compartidas
- estructura de archivos y módulos
- convenciones de nombres
- separación de responsabilidades
- organización interna de lógica

## Principio rector
Un refactor solo es válido si mejora al menos una de estas dimensiones sin cambiar comportamiento:

- claridad
- cohesión
- mantenibilidad
- testabilidad
- alineación arquitectónica
- reducción de duplicación
- legibilidad del flujo lógico

Si no mejora alguna de estas de forma real, no debe hacerse.

## Regla máxima
**Nunca cambiar el comportamiento funcional.**

Si existe duda razonable sobre impacto funcional:
- no ejecutar el refactor automáticamente
- proponerlo como recomendación
- explicar el riesgo
- aislarlo en un bloque separado

## Nivel de agresividad permitido
Esta skill puede ejecutar refactors de alto alcance interno siempre que sean seguros y preserven comportamiento, incluyendo:

- extracción de funciones
- extracción de hooks
- extracción de services
- división de archivos grandes
- reorganización de módulos
- consolidación de duplicaciones
- mejora de nombres
- simplificación de flujo lógico
- mover lógica a la capa correcta
- mejorar contratos y tipado
- aislar responsabilidades mezcladas

No puede:
- cambiar reglas de negocio
- alterar contratos externos sin necesidad
- modificar comportamiento de UI o API
- introducir nuevas features
- aprovechar el refactor para “corregir” comportamiento no solicitado

## Filosofía de refactor
Preferir siempre:

- claridad sobre cleverness
- expresividad sobre brevedad
- cohesión sobre compactación
- guard clauses sobre nesting profundo
- nombres claros sobre abreviaciones ingeniosas
- cambios atómicos sobre grandes reescrituras
- arquitectura correcta sobre hacks locales

No asumir que “menos líneas” significa “mejor código”.

## Flujo del agente
Ante cualquier tarea de refactor, seguir este orden:

1. **Auditar la unidad actual**
   - archivo
   - módulo
   - componente
   - función
   - hook
   - serializer
   - service
   - view
   - manager
   - query flow

2. **Clasificar la deuda técnica detectada**
   - duplicación
   - baja cohesión
   - demasiadas responsabilidades
   - naming deficiente
   - capa incorrecta
   - complejidad innecesaria
   - tipado deficiente
   - estructura de archivo pobre
   - condicionales difíciles
   - acoplamiento excesivo

3. **Validar seguridad del refactor**
   - confirmar que no cambia inputs/outputs esperados
   - confirmar que no altera contratos
   - confirmar que no modifica reglas de negocio
   - confirmar que puede aislarse de forma atómica

4. **Priorizar el refactor**
   - primero los cambios de mayor mejora con menor riesgo
   - luego los cambios estructurales internos
   - dejar fuera cualquier cambio con riesgo funcional

5. **Ejecutar solo refactors seguros**
   - aplicar cambios internos
   - mantener comportamiento
   - preservar compatibilidad

6. **Verificar**
   - coherencia estructural
   - consistencia con arquitectura
   - legibilidad mejorada
   - ausencia de cambios funcionales intencionales

7. **Reportar**
   - qué se detectó
   - qué se cambió
   - qué se dejó sin tocar
   - por qué fue seguro

## Reglas obligatorias

### 1. Behavior preservation
- no cambiar comportamiento observable
- no cambiar contratos de uso sin necesidad
- no alterar side effects funcionales esperados
- no reordenar lógica sensible si puede afectar semántica
- si un cambio es elegante pero introduce duda funcional, no ejecutarlo

### 2. Claridad y legibilidad
- preferir código que se entienda más rápido
- simplificar flujo de lectura
- reducir nesting innecesario
- usar guard clauses cuando mejoren claridad
- no compactar expresiones si eso empeora comprensión

### 3. Cohesión y responsabilidad
- cada unidad debe tener una responsabilidad principal clara
- dividir funciones o componentes cuando mezclen demasiadas tareas
- mover lógica a su capa correcta:
  - frontend visual -> UI
  - frontend lógica -> hooks / data flow
  - backend dominio -> services / domain layer
  - backend HTTP -> views / serializers
- evitar archivos que concentren demasiadas decisiones distintas

### 4. Duplicación
- eliminar duplicación real y significativa
- no abstraer prematuramente pequeñas similitudes accidentales
- extraer utilidades solo cuando la repetición tenga patrón estable
- consolidar lógica compartida sin volverla demasiado genérica

### 5. Naming
- mejorar nombres ambiguos, genéricos o engañosos
- usar nombres que expresen intención, no implementación accidental
- evitar abreviaciones crípticas
- mantener consistencia con convenciones del proyecto

### 6. Tipado y contratos
- reforzar tipos cuando aclaren intención y reduzcan ambigüedad
- eliminar `any` innecesarios
- mejorar tipos de props, estado, responses, requests o interfaces cuando el refactor lo permita sin alterar comportamiento
- preservar contratos públicos salvo que el cambio sea completamente interno y seguro

### 7. Alineación arquitectónica
- si una lógica está en la capa incorrecta, moverla
- frontend: sacar lógica de negocio o networking de componentes visuales
- backend: sacar lógica compleja de views/serializers si debe vivir en services
- respetar las skills de arquitectura, frontend y backend ya definidas

### 8. Atomicidad de cambios
- separar refactors por intención
- no mezclar refactor con feature nueva
- no mezclar renaming masivo con cambios lógicos si se puede evitar
- preparar cambios compatibles con commits atómicos

## Qué sí debe proponer y ejecutar
- extraer función privada o helper
- extraer hook personalizado
- extraer service o capa de dominio
- dividir componente gigante
- dividir archivo excesivamente largo
- simplificar condicionales complejos
- reemplazar nesting profundo por flujo más claro
- consolidar duplicación estable
- renombrar variables, funciones, props o métodos ambiguos
- mover código a carpeta o módulo más coherente
- mejorar tipado interno
- reemplazar estructuras frágiles por otras más expresivas si el comportamiento se conserva

## Qué debe evitar aunque “se vea mejor”
- convertir `if` claros en ternarios difíciles
- usar lambdas, one-liners o expresiones compactas solo por estilo
- introducir abstracciones “elegantes” que oculten la intención
- generalizar demasiado pronto
- fusionar múltiples refactors no relacionados
- mover demasiado código de una vez sin motivo
- tocar archivos estables sin beneficio claro
- cambiar nombres públicos o contratos sin necesidad

## Anti-patrones prohibidos
- refactor por gusto personal
- refactor para “verse más senior”
- reducir líneas a costa de claridad
- cleverness innecesario
- mezclar refactor con corrección funcional no solicitada
- cambiar estructura y lógica al mismo tiempo sin aislar el riesgo
- crear helpers genéricos de valor dudoso
- abstraer antes de entender el patrón real
- reemplazar código explícito por magia difícil de seguir

## Lógica de decisión

### Si el código es largo pero claro
- no refactorizar solo por longitud
- refactorizar solo si la longitud está ocultando responsabilidades mezcladas

### Si hay un `if` claro
- mantenerlo si es legible
- simplificarlo solo si la lectura mejora objetivamente

### Si hay nesting profundo
- preferir guard clauses o extracción de funciones
- reducir complejidad de lectura sin alterar semántica

### Si hay duplicación
- confirmar que la lógica duplicada es realmente la misma
- extraer solo si el patrón es estable y reutilizable

### Si una unidad mezcla varias responsabilidades
- separar por capa o responsabilidad
- mover cada parte a su lugar correcto

### Si el nombre no comunica intención
- renombrar a algo más expresivo
- mantener consistencia con naming existente

### Si el refactor requiere cambiar comportamiento para “quedar mejor”
- no ejecutar
- dejarlo como recomendación separada

### Si el refactor afecta API pública, navegación o contratos externos
- evitar ejecución automática
- proponerlo como refactor de mayor riesgo
- requerir evaluación explícita

## Heurísticas de seguridad
Antes de ejecutar un refactor, confirmar que:

1. inputs y outputs siguen siendo equivalentes
2. el flujo funcional no cambia
3. no se altera persistencia ni efectos de negocio
4. no cambia semántica de errores o validaciones
5. el cambio puede describirse como “reorganización interna”
6. el diff no mezcla refactor con feature
7. el cambio puede aislarse en uno o varios commits atómicos

## Integración con otras skills
- usar `frontend_ui_architect` si el refactor es principalmente visual
- usar `frontend_state_data_flow` si el refactor mueve lógica de datos o hooks
- usar `frontend_performance_resilience` si el refactor responde a render o resiliencia
- usar `backend_domain_integrity` si el refactor afecta dominio o transacciones
- usar `django_api_builder` si toca serializers, views o contratos API internos
- usar `backend_query_performance` si mejora queries
- usar `backend_security_audit` si el refactor toca exposición o permisos
- usar `git_protocol` para separar los cambios en commits atómicos
- usar la skill de arquitectura si hay dudas sobre la capa correcta

## Contrato de salida
Cada intervención de refactor debe terminar con:

1. **Unidad auditada**
   - archivo
   - módulo
   - componente
   - función
   - hook
   - service
   - view
   - etc.

2. **Tipo de deuda detectada**
   - duplicación
   - baja cohesión
   - naming
   - complejidad
   - capa incorrecta
   - tipado
   - estructura

3. **Refactors propuestos**
   - lista breve y priorizada

4. **Refactors ejecutados**
   - cuáles se aplicaron realmente
   - por qué eran seguros

5. **Garantía de preservación de comportamiento**
   - por qué el cambio no altera funcionalidad
   - qué límites de seguridad se respetaron

6. **Alineación arquitectónica**
   - cómo mejora el encaje con frontend/backend/arquitectura

7. **Riesgos no ejecutados**
   - qué posibles mejoras se dejaron fuera por riesgo funcional o contractual

8. **Recomendación final**
   - siguiente mejor paso de refactor si aplica

## Formato de respuesta esperado

### Resumen
Qué unidad se auditó y qué problema estructural principal tenía.

### Diagnóstico
Qué deuda técnica existía y por qué afectaba mantenibilidad o claridad.

### Refactor propuesto
Qué cambios eran razonables y cuál era su intención.

### Refactor ejecutado
Qué se aplicó realmente y por qué era seguro.

### Preservación de comportamiento
Por qué el cambio no modifica la funcionalidad observable.

### Riesgos
Qué no se tocó para evitar romper contratos o comportamiento.

### Recomendación final
La mejor siguiente mejora estructural alineada con Domy.

---
*Esta skill refactoriza para mejorar claridad, cohesión y arquitectura. Nunca para introducir cleverness innecesario ni para cambiar comportamiento funcional.*