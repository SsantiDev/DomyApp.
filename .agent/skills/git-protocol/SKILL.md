---
name: git-protocol
description: analiza cambios, los segmenta en bloques atómicos, crea ramas por intención, genera commits usando conventional commits, hace push, mergea a develop, valida el merge y elimina la rama cuando el bloque queda integrado. úsala cuando se necesite persistir cambios en domy con trazabilidad, atomicidad, automatización y flujo git disciplinado.
---

# Git Protocol — Atomic Commits and Automated Integration

Esta skill define el flujo oficial para persistir cambios en Domy con atomicidad, trazabilidad, seguridad y automatización disciplinada usando Git y Conventional Commits.

## Propósito
Usar esta skill cuando se requiera:
- analizar cambios pendientes
- segmentarlos en bloques atómicos
- crear ramas por intención
- generar commits con Conventional Commits
- hacer push de ramas
- mergear a `develop`
- verificar que el merge quedó correcto
- eliminar ramas ya integradas
- repetir el proceso con cambios restantes

## Flujo de trabajo obligatorio
1. Revisar `references/atomicity-rules.md`.
2. Revisar `references/branch-naming.md`.
3. Revisar `references/conventional-commits.md`.
4. Revisar `references/safety-rules.md`.
5. Revisar `references/merge-flow.md`.
6. Revisar `references/conflict-and-failure-policy.md`.
7. Analizar `git status --short` y `git diff`.
8. Identificar el siguiente bloque atómico.
9. Crear una rama nueva desde `develop` según la intención del bloque usando `python3 scripts/create_atomic_branch.py`.
10. Hacer staging selectivo solo del bloque actual.
11. Ejecutar `python3 scripts/verify_git_flow.py`.
12. Verificar con `git diff --cached` que el bloque staged sea coherente.
13. Crear el commit usando Conventional Commits con `python3 scripts/commit_atomic_block.py`.
14. Hacer push de la rama remota.
15. Ejecutar el flujo de merge a `develop` con `python3 scripts/merge_to_develop.py`.
16. Verificar el estado posterior al merge.
17. Eliminar la rama local y remota si el merge fue exitoso.
18. Repetir el ciclo con el siguiente bloque atómico hasta vaciar los cambios pendientes.

## Reglas obligatorias
- Un commit debe representar una sola intención.
- No mezclar tipos incompatibles de cambio en un mismo commit.
- Nunca usar `git add .` de forma indiscriminada.
- La rama debe crearse específicamente para el bloque actual.
- Todo merge debe verificarse antes de eliminar la rama.
- Si hay riesgo funcional, conflictos o dudas sobre el bloque, detener la automatización y reportar el riesgo.
- Nunca exponer secretos, credenciales, logs sensibles o archivos locales irrelevantes.
- No dejar cambios parcialmente mezclados entre ramas.
- No crear commits vacíos salvo solicitud explícita del usuario.
- No borrar ramas si no hay confirmación clara de integración en `develop`.

## Principios de atomicidad
- un bloque atómico = una sola intención de cambio
- un commit = un propósito verificable
- una rama = un bloque de trabajo integrable
- tests y cambios directamente relacionados deben viajar juntos
- la segmentación debe favorecer revisión, rollback y trazabilidad
- si un diff no puede describirse en una sola frase clara, no es atómico

## Tipos de cambio permitidos
Usar Conventional Commits de forma estricta:
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `refactor:` reestructuración sin cambio funcional
- `docs:` documentación
- `test:` pruebas
- `style:` formato sin impacto lógico
- `chore:` mantenimiento o tooling
- `build:` cambios de build o dependencias de compilación
- `ci:` integración continua o automatización de pipelines
- `perf:` mejora de rendimiento sin cambio de comportamiento observable

## Reglas de integración
- Toda rama debe salir desde `develop`.
- Todo merge debe volver a `develop`.
- Toda integración debe dejar el repositorio en estado consistente.
- Tras un merge exitoso, la rama local y remota deben eliminarse.
- Si quedan cambios pendientes, el ciclo debe reiniciarse desde el análisis del siguiente bloque atómico.

## Qué debe incluir toda ejecución
Toda ejecución de esta skill debe informar:
- bloque atómico identificado
- tipo de cambio
- rama creada
- archivos incluidos en el bloque
- commit generado
- resultado del push
- resultado del merge
- verificación posterior al merge
- eliminación de rama
- cambios restantes por procesar

## Qué debe evitar esta skill
- commits genéricos o ambiguos
- ramas sin intención clara
- mezclar refactor con feature no relacionada
- mezclar fix con style o docs no relacionados
- automatizar merges sin verificar estado
- usar Git como simple almacenamiento sin trazabilidad
- dejar ramas huérfanas o flujos incompletos
- empujar cambios sin análisis del bloque

## Regla final
Ningún cambio debe llegar a `develop` sin haber pasado por segmentación atómica, commit convencional, verificación, merge controlado y cierre limpio de rama.