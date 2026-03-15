# Frontend refactor patterns — Domy

## Objetivo
Definir patrones seguros de refactor para frontend React Native con TypeScript.

## Refactors recomendados
- extraer función privada
- extraer hook personalizado
- dividir componente gigante
- separar presentación de lógica
- mover networking fuera de componentes visuales
- mover transformación de datos a helpers o hooks
- simplificar condicionales complejos
- mejorar nombres de props, handlers y variables
- mejorar tipado de props, estado y responses internas

## Señales de refactor
- componente demasiado largo
- demasiados useEffect mezclados
- handlers excesivamente largos
- JSX difícil de seguir
- lógica de negocio dentro del render
- uso excesivo de estados locales sin organización clara
- repetición de lógica entre pantallas o componentes

## Regla de separación
- UI visual debe quedarse en componentes
- lógica de interacción o composición puede vivir en hooks
- acceso a datos debe evitar mezclarse con render
- reglas de negocio no deben consolidarse en componentes visuales

## Anti-patrones
- extraer hooks solo para “verse mejor”
- crear helpers genéricos sin patrón estable
- mover demasiada lógica fuera del componente si eso empeora trazabilidad
- dividir un componente claro solo por longitud

## Regla final
El frontend debe quedar más legible, más cohesivo y con flujo mental más corto sin alterar experiencia observable.