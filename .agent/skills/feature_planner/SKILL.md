---
name: "domy_feature_planner"
description: "Expert guide for decomposing, planning, and sequencing complete features across frontend, backend, architecture, testing, refactor, and git workflow in Domy. Use when a feature is described in natural language and must be translated into an actionable implementation plan with risks, models, endpoints, screens, hooks, tests, and atomic commits."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Planning & Delivery
fecha_actualizacion: 2026-03-08
tags: [feature-planning, architecture, frontend, backend, delivery, roadmap, commits, implementation-plan]
---
# Domy Feature Planner

## Propósito
Esta skill define el estándar para planificar features completas en Domy. Debe usarse cuando una necesidad funcional todavía no está descompuesta técnicamente y se requiere convertirla en un plan claro, ejecutable y alineado con la arquitectura oficial del proyecto.

Su trabajo es tomar una feature descrita en lenguaje natural y transformarla en:

- objetivo funcional claro
- impacto por capas
- backend requerido
- frontend requerido
- datos y contratos
- riesgos y dependencias
- secuencia de implementación
- tests mínimos
- refactors sugeridos
- commits atómicos propuestos

## Cuándo aplicar esta skill
- cuando el usuario describa una feature completa sin plan técnico
- cuando se necesite bajar una idea a frontend, backend y arquitectura
- cuando haya que decidir por dónde empezar una implementación
- cuando una feature afecte múltiples capas del sistema
- cuando se quiera preparar trabajo para el agente del IDE
- cuando se necesite proponer endpoints, modelos, pantallas, hooks o flujos
- cuando se quiera obtener un roadmap corto de implementación antes de tocar código

## Qué hace esta skill
Esta skill debe:

1. entender la feature desde el objetivo de negocio
2. descomponerla en bloques técnicos
3. repartir responsabilidades entre frontend, backend y arquitectura
4. detectar riesgos y dependencias
5. proponer contratos, modelos, hooks, pantallas o endpoints cuando aplique
6. definir una secuencia lógica de implementación
7. sugerir pruebas mínimas
8. proponer commits atómicos alineados con `git_protocol`

## Qué no hace esta skill
- no implementa directamente código
- no mezcla planificación con desarrollo efectivo
- no inventa complejidad innecesaria
- no propone trabajo fuera del stack oficial salvo petición explícita
- no cambia arquitectura sin justificarlo
- no mezcla refactors profundos con features nuevas sin aislarlos

## Integración con otras skills
Esta skill debe apoyarse conceptualmente en:

- `domy_architecture` o skill de arquitectura oficial para validar reparto por capas
- `frontend_domy_expert` y sus sub-skills para frontend
- `backend_domy_expert` y sus sub-skills para backend
- `domy_refactor_guard` si la feature requiere limpiar estructura previa
- `git_protocol` para sugerir commits atómicos
- `testing_guard` si existe, para profundizar estrategia de pruebas

## Flujo del agente
Ante cualquier feature, seguir este orden:

1. **Entender la intención**
   - cuál es el objetivo funcional
   - quién usa la feature
   - qué problema resuelve
   - cuál es el resultado esperado

2. **Delimitar el alcance**
   - qué sí entra en la feature
   - qué no entra
   - qué supuestos existen
   - qué dependencias previas necesita

3. **Descomponer la feature**
   - flujo principal
   - subflujos
   - estados clave
   - validaciones
   - errores esperados
   - edge cases

4. **Mapear por capas**
   - frontend
   - backend
   - datos / persistencia
   - seguridad
   - navegación / UX
   - performance / resiliencia si aplica

5. **Definir piezas técnicas**
   - pantallas
   - componentes
   - hooks
   - contexto o estado
   - endpoints
   - serializers
   - servicios
   - modelos
   - constraints
   - queries
   - permisos

6. **Detectar riesgos**
   - ambigüedad funcional
   - dependencia entre capas
   - riesgo de contratos
   - riesgo de seguridad
   - riesgo de performance
   - deuda técnica previa
   - necesidad de refactor

7. **Secuenciar implementación**
   - decidir orden más seguro y eficiente
   - separar prerequisitos
   - definir bloques implementables

8. **Sugerir pruebas**
   - unitarias
   - integración
   - UI
   - permisos
   - estados de error
   - contratos API

9. **Proponer commits atómicos**
   - dividir por intención técnica real
   - no mezclar frontend y backend en un mismo commit si no corresponde
   - alinear cada bloque con `git_protocol`

## Reglas obligatorias

### 1. Planificar desde el valor funcional
- comenzar por el objetivo de negocio o usuario
- no empezar por archivos o tecnologías
- toda pieza técnica debe responder a una necesidad funcional concreta

### 2. Separación por capas
- repartir claramente qué vive en frontend y qué vive en backend
- no duplicar reglas de negocio sensibles en frontend
- el backend debe sostener validaciones críticas, integridad y permisos
- el frontend debe encargarse de experiencia, estado local y consumo tipado

### 3. Descomposición ejecutable
- dividir la feature en bloques pequeños y entendibles
- cada bloque debe ser implementable de forma atómica
- evitar planes que dependan de hacer todo a la vez

### 4. Riesgo visible
- todo plan debe señalar riesgos y dependencias
- si una parte está ambigua, decirlo explícitamente
- no presentar incertidumbre como si fuera certeza

### 5. Compatibilidad con arquitectura
- respetar el stack oficial
- alinear la solución con las skills de arquitectura, frontend y backend
- si la feature exige excepción, justificarla claramente

### 6. Testing mínimo obligatorio
- ninguna feature debe quedar sin plan de validación
- definir al menos qué debe probarse y por qué
- incluir estados felices, errores y permisos cuando aplique

### 7. Commits atómicos
- proponer commits por intención real, no por archivo
- separar estructura, backend, frontend, tests y refactors cuando convenga
- no agrupar todo en un solo commit

## Anti-patrones prohibidos
- convertir la feature en una lista desordenada de tareas
- mezclar solución técnica con wish list futura
- poner frontend y backend sin delimitar responsabilidades
- proponer endpoints sin explicar su propósito
- proponer componentes sin explicar el flujo
- ignorar validaciones, errores o permisos
- omitir riesgos importantes
- sugerir un solo gran commit
- depender de refactors invisibles sin decirlo

## Lógica de decisión

### Si la feature es pequeña pero toca varias capas
- mantenerla pequeña en alcance
- aun así separar por backend, frontend y tests

### Si la feature depende de datos nuevos
- definir primero modelo, constraints y contrato API
- luego definir hooks, estado y UI

### Si la feature es principalmente visual
- liderar desde frontend
- validar si necesita soporte backend o solo composición UI

### Si la feature es principalmente de reglas de negocio
- liderar desde backend
- luego definir cómo el frontend consume y representa ese flujo

### Si la feature tiene incertidumbre funcional
- explicitar preguntas o supuestos
- planificar con límites claros y riesgos marcados

### Si la feature exige refactor previo
- separar ese refactor como prerrequisito
- no esconderlo dentro de la feature principal

### Si el trabajo parece demasiado grande
- dividir en fases o milestones
- priorizar un primer entregable funcional

## Estructura obligatoria del plan
Toda feature planificada debe incluir estas secciones:

1. **Objetivo funcional**
2. **Alcance**
3. **Supuestos y dependencias**
4. **Descomposición funcional**
5. **Impacto por capas**
6. **Backend requerido**
7. **Frontend requerido**
8. **Datos, contratos o persistencia**
9. **Seguridad y validaciones**
10. **Riesgos técnicos**
11. **Secuencia de implementación**
12. **Plan de pruebas**
13. **Commits atómicos sugeridos**

## Contrato de salida
Cada intervención debe terminar con:

1. **Resumen de la feature**
   - qué resuelve
   - quién la usa
   - cuál es el resultado esperado

2. **Mapa técnico por capas**
   - frontend
   - backend
   - datos
   - seguridad
   - UX / resiliencia si aplica

3. **Piezas a construir**
   - modelos
   - endpoints
   - serializers
   - servicios
   - hooks
   - pantallas
   - componentes
   - navegación
   - tests

4. **Riesgos y dependencias**
   - qué puede bloquear
   - qué necesita definirse
   - qué debe validarse antes

5. **Secuencia recomendada**
   - orden concreto de implementación
   - bloques listos para ejecutar

6. **Commits atómicos**
   - lista de commits sugeridos
   - intención de cada commit

7. **Recomendación final**
   - mejor estrategia para implementar la feature en Domy

## Formato de respuesta esperado

### 1. Objetivo funcional
Explica qué hace la feature y qué problema resuelve.

### 2. Alcance
Aclara qué incluye esta feature y qué queda fuera.

### 3. Descomposición funcional
Divide la feature en subflujos o capacidades.

### 4. Impacto por capas
Describe qué cambia en frontend, backend, datos y seguridad.

### 5. Backend requerido
Lista modelos, servicios, endpoints, validaciones, permisos o queries necesarias.

### 6. Frontend requerido
Lista pantallas, componentes, hooks, navegación, estados y UX necesaria.

### 7. Datos y contratos
Define payloads, persistencia, mapeos y contratos principales si aplica.

### 8. Riesgos técnicos
Señala ambigüedades, riesgos y dependencias.

### 9. Secuencia de implementación
Propón el orden ideal para construir la feature.

### 10. Plan de pruebas
Define qué validar como mínimo.

### 11. Commits atómicos sugeridos
Propón bloques de commits coherentes con `git_protocol`.

### 12. Recomendación final
Resume la mejor ruta para ejecutar la feature con seguridad y claridad.

## Criterio de calidad
Un buen plan de feature debe ser:

- claro
- ejecutable
- alineado con arquitectura
- realista
- atómico
- validable
- útil para que otro agente o desarrollador lo implemente sin improvisar

---
*Esta skill convierte ideas de producto en planes técnicos ejecutables, consistentes y alineados con la arquitectura de Domy.*