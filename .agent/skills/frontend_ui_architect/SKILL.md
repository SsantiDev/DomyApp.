---
name: "frontend_ui_architect"
description: "Expert guide for UI architecture, visual components, layout composition, and typed navigation in Domy using React Native."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Visual Consistency & UI Quality
fecha_actualizacion: 2026-03-08
tags: [react-native, ui-architecture, atomic-design, design-system, navigation]
---
# Frontend UI Architect — Estructura Visual

## Propósito
Esta skill se especializa en la construcción de interfaces premium siguiendo el flujo de diseño atómico. Su objetivo es garantizar que la UI de Domy sea modular, responsiva, consistente y que la navegación sea robusta y tipada.

## Cuándo Aplicar esta Skill
- Diseño y creación de componentes reutilizables (Átomos, Moléculas, Organismos).
- Implementación de nuevas pantallas (Screens) y composición de layouts.
- Configuración o modificación de flujos de navegación.
- Aplicación de estilos mediante tokens del Design System.
- Auditoría de consistencia visual y jerarquía en la UI.

## Flujo del Agente
1. **Modelado Visual:** Identificar la estructura de componentes necesaria (Atomic Design).
2. **Definición de Props:** Tipar las propiedades del componente priorizando la reutilización.
3. **Composición de Estilos:** Aplicar estilos usando `StyleSheet` y tokens del Design System.
4. **Arquitectura de Navegación:** Definir rutas y parámetros en el esquema central de React Navigation.
5. **Verificación Visual:** Confirmar que el layout es responsivo y fiel a los tokens oficiales.

## Reglas Obligatorias
- **Atomic Design:** Descomponer la UI en elementos base antes de construir pantallas complejas.
- **Design System First:** Prohibido el uso de magic numbers. Usar tokens oficiales para todo.
- **Typed Navigation:** Todas las rutas y parámetros deben existir en el `ParamList` central.
- **Pure UI:** Los componentes visuales no deben contener lógica de red o efectos secundarios.

## Anti-patrones Prohibidos
- Componentes gigantes (>200 líneas) con lógica de red o negocio pesada mezclada.
- Estilos inline masivos que no utilicen el sistema de temas.
- Navegación "frágil" (usar strings literales para navegar en lugar de rutas tipadas).
- Duplicación de estilos base en múltiples lugares del código.

## Lógica de Decisión
- **¿Es un elemento base (botón, input)?** -> Crear como Átomo.
- **¿Es una sección con varios elementos (header, card)?** -> Crear como Molécula/Organismo.
- **¿El estilo se repite más de 2 veces?** -> Extraer a un componente o token global.

## Contrato de Salida
Cada intervención de UI debe finalizar con:
1. **Resumen de Estructura:** Componentes creados/modificados.
2. **Impacto Visual:** Descripción de los cambios en la UI.
3. **Matriz de Props:** Confirmación del tipado de las nuevas interfaces.
4. **Estado de Navegación:** Actualización (si aplica) de las rutas tipadas.

---
*Referencia: Consulta `references/design-system.md` para tokens oficiales.*
