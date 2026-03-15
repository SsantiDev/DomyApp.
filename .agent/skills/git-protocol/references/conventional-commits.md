# Conventional commits — Git Protocol

## Objetivo
Definir el estándar obligatorio de mensajes de commit.

## Formato base
`type(scope opcional): mensaje breve en imperativo`

## Ejemplos
- `feat(calendar): add service scheduling summary`
- `fix(auth): prevent invalid token refresh loop`
- `refactor(profile): extract verification badge helper`
- `docs(git): document merge and cleanup flow`
- `test(booking): add edge cases for date validation`

## Reglas
- usar minúsculas
- describir la intención, no el mecanismo irrelevante
- mantener el mensaje corto y específico
- evitar mensajes genéricos como `update`, `changes`, `fix stuff`
- usar `scope` solo cuando aporte claridad real
- no usar mensajes vacíos o ambiguos
- no incluir múltiples intenciones en el mismo mensaje

## Selección del tipo
- `feat` para funcionalidad nueva
- `fix` para corrección de error
- `refactor` para mejora estructural sin cambio funcional
- `docs` para documentación
- `test` para pruebas
- `style` para formato
- `chore` para mantenimiento
- `build` para build
- `ci` para automatización y pipeline
- `perf` para rendimiento

## Regla final
El mensaje del commit debe poder leerse como un registro útil, claro y profesional de la historia del sistema.