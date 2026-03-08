---
name: "frontend_ui_architect"
description: "expert guide for ui architecture, visual component design, screen composition, design system usage, and typed navigation in domy using react native and typescript. use when designing, implementing, reviewing, or refactoring components, screens, layouts, and navigation flows."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Visual Consistency & UI Quality
fecha_actualizacion: 2026-03-08
tags: [react-native, ui-architecture, atomic-design, design-system, navigation, frontend, typescript]
---
# Frontend UI Architect

## Propósito
Esta skill define el estándar de arquitectura visual del frontend de Domy. Debe usarse para diseñar, construir, revisar y refactorizar componentes, pantallas, layouts y navegación, asegurando modularidad, consistencia visual, reutilización y robustez de navegación.

## Cuándo aplicar esta skill
- creación de componentes reutilizables
- construcción o refactorización de pantallas
- composición de layouts
- organización de una interfaz usando Atomic Design cuando aporte claridad
- diseño o modificación de navegación
- revisión de consistencia visual
- alineación de una feature con el design system
- auditoría de estructura UI y jerarquía visual

## Qué protege esta skill
Esta skill protege cuatro áreas principales:

1. **Arquitectura visual**
   - estructura clara de componentes
   - separación entre piezas reutilizables y pantallas completas

2. **Consistencia de diseño**
   - uso correcto de tokens
   - alineación con patrones visuales oficiales

3. **Composición de UI**
   - layouts legibles
   - componentes pequeños y bien definidos
   - evitar monolitos visuales

4. **Navegación tipada**
   - rutas explícitas
   - params bien definidos
   - flujos de navegación robustos

## Flujo del agente
Ante cualquier tarea de UI, seguir este orden:

1. **Clasificar el tipo de intervención**
   - átomo
   - molécula
   - organismo
   - pantalla
   - layout
   - navegación
   - auditoría visual

2. **Definir el nivel correcto de abstracción**
   - decidir si el cambio debe vivir en componente base, sección reutilizable o screen
   - evitar crear componentes demasiado genéricos o demasiado específicos sin necesidad

3. **Diseñar la API visual**
   - definir props claras y tipadas
   - evitar props ambiguas, excesivas o difíciles de mantener

4. **Aplicar el design system**
   - usar tokens oficiales para spacing, color, tipografía, radius y elevación
   - mantener coherencia visual con pantallas existentes

5. **Validar navegación**
   - tipar rutas y params
   - asegurar que la navegación sea explícita y robusta

6. **Verificar calidad visual**
   - revisar jerarquía, legibilidad, composición y responsividad básica

## Reglas obligatorias

### 1. Arquitectura de componentes
- construir componentes pequeños, enfocados y reutilizables
- usar Atomic Design cuando ayude a ordenar el sistema visual
- no convertir Atomic Design en rigidez innecesaria; usarlo como guía, no como burocracia
- preferir composición sobre componentes gigantes
- separar componentes base de pantallas completas

### 2. Props y tipado
- toda prop debe estar tipada explícitamente
- evitar componentes con demasiadas props opcionales ambiguas
- preferir APIs de componentes claras, pequeñas y legibles
- diseñar componentes para uso real, no para supuesta reutilización infinita

### 3. Design system
- usar tokens oficiales para colores, tamaños, espaciados, tipografía, radios y sombras
- prohibido usar magic numbers sin justificación clara
- evitar estilos duplicados si pueden resolverse con tokens o componentes compartidos
- mantener consistencia de padding, spacing y jerarquía visual entre pantallas

### 4. Layout y composición
- construir layouts legibles y fáciles de mantener
- evitar JSX excesivamente profundo o anidado sin necesidad
- dividir pantallas complejas en secciones reutilizables
- priorizar legibilidad visual y claridad estructural

### 5. Navegación tipada
- todas las rutas deben estar definidas en el esquema central de navegación tipada
- todos los params deben estar tipados explícitamente
- evitar navegación por strings sueltos o contratos implícitos
- validar que los flujos protegidos respeten el estado de sesión

### 6. Pure UI
- los componentes visuales no deben contener lógica de red
- los componentes visuales no deben contener side effects complejos
- la UI debe enfocarse en renderizar y delegar lógica a hooks o capas de datos cuando corresponda

## Anti-patrones prohibidos
- componentes gigantes con demasiada responsabilidad
- mezclar render, navegación compleja, lógica de negocio y networking en el mismo archivo
- estilos inline masivos o inconsistentes
- duplicar estilos base en múltiples lugares
- usar valores hardcodeados que deberían salir del design system
- props tan genéricas que vuelven el componente ambiguo
- navegación frágil basada en strings literales
- crear componentes reutilizables que en realidad solo sirven para una pantalla pero con complejidad innecesaria

## Lógica de decisión

### Si el elemento es base y altamente reutilizable
- tratarlo como átomo
- mantener props mínimas y claras

### Si agrupa varios elementos con función visual específica
- tratarlo como molécula u organismo
- encapsular layout y composición recurrente

### Si representa una experiencia completa de usuario
- tratarlo como pantalla
- delegar la lógica no visual fuera del archivo si crece demasiado

### Si el cambio afecta jerarquía, espaciado o consistencia
- revisar primero design system y patrones existentes antes de inventar una nueva variante

### Si el flujo incluye navegación
- definir o actualizar `ParamList`
- asegurar tipado de entrada y salida cuando aplique

### Si un estilo o patrón visual se repite
- evaluar extraer componente compartido o abstracción visual
- no duplicar por comodidad

## Prioridades de diseño
Cuando haya varias mejoras posibles, priorizar en este orden:

1. claridad estructural de la UI
2. consistencia con el design system
3. tipado correcto de props y navegación
4. reutilización realista
5. refinamiento visual secundario

## Contrato de salida
Cada intervención de UI debe terminar con:

1. **Tipo de intervención**
   - átomo
   - molécula
   - organismo
   - pantalla
   - navegación
   - auditoría visual

2. **Estructura propuesta**
   - componentes creados o modificados
   - jerarquía visual resultante

3. **Impacto visual**
   - qué cambia en layout, composición o consistencia

4. **Tipado**
   - props nuevas o ajustadas
   - rutas y params tipados si aplica

5. **Alineación con design system**
   - qué tokens o patrones se aplicaron
   - qué duplicaciones o inconsistencias se evitaron

6. **Riesgos o trade-offs**
   - sobre-abstracción
   - complejidad innecesaria
   - acoplamiento visual
   - deuda de navegación

7. **Recomendación final**
   - mejor implementación visual compatible con Domy

## Formato de respuesta esperado

### Resumen
Qué componente, pantalla o flujo visual se está diseñando o auditando.

### Estructura visual
Cómo se divide la UI y qué piezas se crean o reutilizan.

### Props y navegación
Qué contratos visuales o de navegación deben existir.

### Design system
Qué tokens, patrones o decisiones visuales gobiernan la implementación.

### Riesgos
Qué puede degradar mantenibilidad, consistencia o claridad visual.

### Recomendación final
La mejor solución de arquitectura UI para Domy.

---
*Consultar `references/design-system.md` para tokens y reglas visuales, y `references/navigation-patterns.md` para convenciones de rutas y params.*