---
name: "frontend_domy_expert"
description: "Expert frontend guide for Domy using React Native and TypeScript. Acts as the mother skill and router for specialized sub-skills."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Architecture & Coordination
fecha_actualizacion: 2026-03-08
tags: [react-native, typescript, frontend, orchestration, engineering-standard]
---
# Frontend Domy Master — Skill Maestra

## Propósito
Esta es la skill madre del ecosistema frontend de Domy. Su función es definir el estándar de ingeniería global, orquestar el uso de las skills especializadas y garantizar la consistencia técnica en todo el desarrollo móvil.

## Stack Oficial
- **Core:** React Native (iOS & Android)
- **Lenguaje:** TypeScript (Strict Mode)
- **Navegación:** React Navigation (Typed)
- **Estado:** Context API / Hooks Personalizados
- **Persistencia:** AsyncStorage / SQLite
- **Seguridad:** JWT (Protocolo de Auth Domy)

## Principios Transversales
1. **Excelencia Visual:** Interfaces premium, fluidas y consistentes con el Design System.
2. **Type Safety:** Tipado riguroso en todas las capas del cliente para minimizar errores en runtime.
3. **Resiliencia UX:** Manejo preventivo de estados de carga, error y red intermitente.
4. **Separación de Responsabilidades:** Clara distinción entre render (UI), lógica (Hooks) y datos (API/Persistencia).

## Cuándo Aplicar las Skills Hijas
Ante una tarea específica, delega la responsabilidad según el área de impacto:

- **¿Diseño de componentes, pantallas, estilos o navegación?**
  👉 Usa `frontend_ui_architect`
- **¿Manejo de estados, lógica de negocio, integración con APIs o persistencia?**
  👉 Usa `frontend_state_data_flow`
- **¿Optimización de rendimiento, listas complejas o robustez ante fallos/offline?**
  👉 Usa `frontend_performance_resilience`

## Flujo Maestro del Agente
1. **Diagnóstico:** Identificar la naturaleza del cambio solicitado.
2. **Activación:** Invocar la(s) skill(s) hija(s) pertinente(s).
3. **Integración:** Combinar las soluciones especializadas bajo los principios de esta skill madre.
4. **Verificación:** Ejecutar validaciones globales y asegurar la consistencia del bloque atómico.

## Reglas Obligatorias Globales
- **Type Integrity:** Prohibido el uso de `any`. Toda interfaz debe ser explícita.
- **Estructura Atómica:** Respetar la modularidad y separación de capas (UI vs Data vs Performance).
- **UX Resilience:** Todo nuevo flujo debe contemplar estados de carga (Loading) y error.
- **Estándar de Naming:** Usar camelCase para variables/hooks y PascalCase para componentes.

## Contrato de Salida Global
Tras completar una tarea de frontend, el reporte debe resumir:
1. **Área intervenida:** (UI, Data, Performance o Mix).
2. **Skills Hijas utilizadas.**
3. **Impacto en el sistema:** (Cambios clave realizados).
4. **Garantía de Calidad:** Resultado de las verificaciones realizadas.

---
*Referencia: Esta skill coordina la ejecución técnica superior de Domy en Mobil.*
