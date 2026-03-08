---
name: "frontend_state_data_flow"
description: "Expert guide for state management, custom hooks, API integration, and local persistence in Domy using React Native and TypeScript."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Data Integrity & Business Logic
fecha_actualizacion: 2026-03-08
tags: [react-native, state-management, custom-hooks, networking, persistence, jwt]
---
# Frontend State & Data Flow — El Motor Lógico

## Propósito
Esta skill se especializa en la gestión del flujo de datos, la sincronización con el backend y la persistencia local. Su objetivo es garantizar que la lógica de negocio esté bien encapsulada, sea testeable y que los datos en el cliente sean consistentes y seguros.

## Cuándo Aplicar esta Skill
- Implementación de gestión de estado global (Context API).
- Creación de Hooks Personalizados para lógica de negocio o synchronization.
- Integración y consumo de endpoints REST.
- Persistencia local (AsyncStorage/SQLite) para sesión o caché.
- Gestión de JWT y lógica de interceptores de red.

## Flujo del Agente
1. **Auditoría de Requerimientos:** Identificar las entidades de datos y el alcance del estado (¿Local o Global?).
2. **Modelado de Contratos:** Definir interfaces TypeScript precisas para los payloads de la API (Request/Response).
3. **Abstracción Lógica:** Crear Hooks Personalizados que orquesten el fetch y la mutación de datos.
4. **Caché y Persistencia:** Implementar persistencia resiliente para mejorar la experiencia offline.
5. **Seguridad de Flujo:** Validar la inclusión de JWT y el manejo de errores semánticos (401, 403, 404).

## Reglas Obligatorias
- **Logic Abstraction:** Prohibido el fetch directo en componentes. Todo pasa por Hooks Personalizados.
- **Type-Safe Contracts:** Todo payload de API debe tener una interfaz TypeScript explícita.
- **Context Integrity:** Usar Context solo para datos transversales. Evitar el "prop drilling" excesivo.
- **JWT Middleware:** Centralizar el manejo del refresh token y la redirección por falta de permisos mediante interceptores.

## Anti-patrones Prohibidos
- Llamadas `axios` o `fetch` directas dentro de un `useEffect` en una Screen sin abstracción.
- Uso de `any` para modelar respuestas de API.
- Almacenar contraseñas o datos altamente sensibles en texto plano en `AsyncStorage`.
- Depender de que el backend siempre responde exitosamente (no manejar errores 4xx/5xx).

## Lógica de Decisión
- **¿El estado se usa en más de 2 pantallas distantes?** -> Usar Context Global.
- **¿Es una acción asíncrona o lógica repetitiva?** -> Extraer a un Hook Personalizado.
- **¿El dato es sensible y persistente?** -> Usar AsyncStorage con cifrado o lógica de limpieza.

## Contrato de Salida
Cada intervención de flujo de datos debe finalizar con:
1. **Hooks/Servicios creados:** Lista técnica.
2. **Esquema de Datos:** Definición de las nuevas interfaces TS.
3. **Estrategia de Estado:** Explicación de cómo se almacena y actualiza el dato.
4. **Check de Seguridad:** Confirmación de manejo de errores y JWT.

---
*Referencia: Consulta `references/api-contracts.md` para contratos base.*
