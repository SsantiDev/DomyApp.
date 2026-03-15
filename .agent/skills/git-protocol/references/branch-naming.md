# Branch naming — Git Protocol

## Objetivo
Definir una convención clara para nombrar ramas según la intención del bloque atómico.

## Regla principal
Toda rama debe:
- salir desde `develop`
- corresponder a un solo bloque atómico
- usar un nombre corto, claro y trazable

## Formato recomendado
`<type>/<short-kebab-description>`

## Tipos permitidos
- `feat/`
- `fix/`
- `refactor/`
- `docs/`
- `test/`
- `style/`
- `chore/`
- `build/`
- `ci/`
- `perf/`

## Ejemplos válidos
- `feat/add-payment-breakdown`
- `fix/calendar-date-parsing`
- `refactor/extract-auth-service`
- `docs/update-git-workflow`
- `test/add-booking-service-tests`
- `chore/update-eslint-config`

## Reglas
- usar kebab-case
- evitar nombres vagos
- evitar ramas genéricas como `changes`, `update`, `new-stuff`
- no reutilizar una misma rama para múltiples intenciones
- no continuar trabajo nuevo sobre una rama ya mergeada

## Regla final
El nombre de la rama debe permitir entender el propósito del bloque sin abrir el diff.