---
name: "frontend_performance_resilience"
description: "expert guide for frontend performance optimization, render stability, memory safety, and ux resilience in domy. use when diagnosing lag, excessive re-renders, slow lists, effect cleanup issues, degraded network behavior, loading/error/empty states, retry flows, offline support, or perceived slowness in react native."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Performance & Reliability
fecha_actualizacion: 2026-03-08
tags: [react-native, performance, resilience, error-handling, offline-first, optimization, memory, rendering, mobile-ux]
---
# Frontend Performance & Resilience

## Propósito
Esta skill define el estándar para rendimiento y resiliencia operativa del frontend de Domy. Debe usarse para diagnosticar, optimizar y reforzar flujos móviles que sufran por lentitud, re-renders innecesarios, listas pesadas, fugas de memoria, latencia de red o experiencias degradadas ante errores y desconexión.

## Cuándo aplicar esta skill
- diagnóstico de lag visual o interacción lenta
- pantallas con re-renders excesivos
- listas largas o costosas (`FlatList`, `SectionList`, `FlashList`)
- auditoría de memoización (`React.memo`, `useMemo`, `useCallback`)
- problemas de timers, listeners, suscripciones o memory leaks
- diseño o mejora de loading, error, empty, retry y success states
- soporte para red inestable, reconexión, offline o feedback optimista
- casos donde la app “funciona” pero se siente lenta o frágil

## Qué debe proteger esta skill
Esta skill protege cinco áreas críticas:

1. **Render performance**
   - evitar renders innecesarios
   - reducir trabajo costoso por ciclo
   - estabilizar props y dependencias

2. **List rendering**
   - virtualización correcta
   - filas ligeras
   - scroll fluido en dispositivos medios

3. **Memory safety**
   - cleanup correcto
   - evitar listeners huérfanos
   - controlar side effects persistentes

4. **UX resilience**
   - loading, error, empty y retry states
   - feedback claro ante espera o fallo
   - percepción de velocidad

5. **Network degradation resilience**
   - comportamiento coherente bajo latencia
   - reintento seguro
   - soporte básico para offline o reconexión

## Flujo del agente
Ante cualquier problema de performance o resiliencia, seguir este orden:

1. **Clasificar el problema**
   - render lento
   - lista pesada
   - side effect inestable
   - fuga de memoria
   - latencia/red degradada
   - UX sin estados intermedios
   - problema mixto

2. **Ubicar la fuente principal del costo o fallo**
   - componente
   - hook
   - lista
   - efecto
   - sincronización remota
   - estrategia de feedback

3. **Determinar si el problema es real o percibido**
   - costo real de render o cálculo
   - problema de estructura de estado
   - falta de feedback al usuario
   - combinación de ambos

4. **Aplicar optimización o refuerzo**
   - optimizar render solo donde haya beneficio
   - reforzar estados UX obligatorios
   - reducir acoplamiento y side effects inestables
   - diseñar para latencia y reconexión

5. **Validar**
   - mejora de fluidez
   - ausencia de fugas
   - comportamiento correcto en loading/error/retry
   - degradación aceptable bajo mala red

## Reglas obligatorias

### 1. Render performance
- no hacer cálculos costosos directamente en cada render si pueden derivarse o memorizarse con criterio
- estabilizar props cuando un componente dependa de referencias que cambian innecesariamente
- usar `React.memo`, `useMemo` y `useCallback` solo cuando exista una razón clara de costo o frecuencia
- evitar estado excesivamente fragmentado o mal distribuido que provoque cascadas de render

### 2. Listas y virtualización
- toda lista larga debe evaluarse para virtualización correcta
- usar `FlatList`, `SectionList` o `FlashList` según el caso
- las filas de listas deben ser ligeras, predecibles y fáciles de memoizar
- revisar `keyExtractor`, tamaño visual, composición y cantidad de trabajo por item
- evitar que cada item haga cálculos caros, fetches innecesarios o cree funciones inestables sin motivo

### 3. Memory safety y cleanup
- limpiar `setTimeout`, `setInterval`, listeners, suscripciones y observers en cleanup
- evitar actualizar estado sobre componentes desmontados
- no dejar side effects vivos fuera del ciclo esperado
- revisar dependencias de `useEffect` para evitar loops, duplicidad o ejecuciones espurias

### 4. UX resiliente
- todo flujo asíncrono relevante debe contemplar:
  - loading state
  - error state
  - empty state
  - success o resolved state
- el usuario nunca debe quedar sin feedback en una operación de espera
- preferir skeletons, placeholders o progresive feedback cuando mejoren la percepción de velocidad
- los errores deben ser accionables, visibles y no bloquear innecesariamente

### 5. Red degradada y offline
- tratar la conectividad como variable, no garantizada
- diseñar comportamiento explícito para timeouts, retry y reconexión
- si existe caché local o persistencia, usarla para sostener continuidad de experiencia cuando aplique
- si el flujo admite optimistic UI, definir rollback o reconciliación clara
- no asumir que la primera petición siempre responderá rápido o correctamente

## Anti-patrones prohibidos
- memoizar todo sin diagnóstico
- dejar componentes lentos porque “igual funciona”
- listas sin virtualización adecuada en flujos volumétricos
- callbacks recreados masivamente dentro de listas sin necesidad
- pantallas sin loading, error o retry en operaciones remotas
- mostrar solo una alerta genérica ante fallo de red
- ignorar warnings de virtualización, re-render o cleanup
- side effects sin limpieza
- optimizaciones que aumentan complejidad sin beneficio real

## Lógica de decisión

### Si el componente es simple y barato
- no memoizar por reflejo
- priorizar claridad sobre micro-optimización

### Si el componente se repite muchas veces en una lista
- evaluar `React.memo`
- estabilizar props
- reducir trabajo por item

### Si el cálculo ocurre en cada render y es costoso
- evaluar `useMemo`
- revisar si puede moverse fuera del render o precomputarse

### Si la UI se siente lenta pero no hay gran costo de render
- revisar estados de loading, placeholders y feedback progresivo
- puede ser un problema de percepción, no solo de CPU

### Si la red falla o está degradada
- mostrar error state claro
- permitir retry
- mantener feedback visible
- reutilizar caché o último estado válido cuando tenga sentido

### Si el problema proviene de un `useEffect`
- revisar dependencias
- revisar cleanup
- revisar duplicidad de side effects
- revisar si el efecto pertenece realmente a ese componente

### Si la lista crece o se vuelve crítica
- revisar virtualización
- revisar estabilidad de filas
- revisar peso visual y computacional por item
- considerar `FlashList` si el caso lo justifica

## Prioridades de optimización
Cuando haya múltiples problemas, priorizar en este orden:

1. bloqueos visibles de interacción
2. memory leaks o efectos sin cleanup
3. listas lentas o scroll degradado
4. ausencia de loading/error/retry
5. micro-optimización de renders secundarios

## Contrato de salida
Cada intervención de performance y resiliencia debe terminar con:

1. **Tipo de problema dominante**
   - render
   - lista
   - memoria
   - red
   - resiliencia UX
   - mixto

2. **Fuente principal del problema**
   - componente
   - hook
   - lista
   - efecto
   - flujo remoto

3. **Optimización o refuerzo aplicado**
   - qué se cambió
   - por qué ese cambio era el correcto

4. **Impacto esperado**
   - mejora de fluidez
   - reducción de renders
   - estabilidad de memoria
   - mejor respuesta bajo red degradada
   - mejor percepción de velocidad

5. **Matriz de resiliencia**
   - loading
   - error
   - empty
   - retry
   - offline/reconexión si aplica

6. **Riesgos o trade-offs**
   - complejidad extra
   - posible sobre-memoización
   - dependencia de caché
   - edge cases pendientes

7. **Recomendación final**
   - mejor solución compatible con la arquitectura frontend de Domy

## Formato de respuesta esperado

### Resumen
Qué pantalla, flujo o componente presenta el problema.

### Diagnóstico
Qué está fallando realmente: render, lista, memoria, red o UX intermedia.

### Optimización propuesta
Qué cambio técnico corrige el problema y por qué.

### Resiliencia UX
Qué estados o estrategias deben existir para que la experiencia no se degrade.

### Validación
Qué se debe comprobar después del cambio.

### Riesgos
Qué trade-offs introduce la solución.

### Recomendación final
La mejora más razonable para Domy sin caer en optimización prematura.

---
*Consultar `references/performance-checklist.md` para validaciones técnicas recurrentes y `references/offline-patterns.md` para estrategias de degradación controlada.*