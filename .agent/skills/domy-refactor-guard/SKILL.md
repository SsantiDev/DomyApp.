---
name: domy-refactor-guard
description: detecta, propone y ejecuta refactors seguros en domy para mejorar claridad, cohesión, mantenibilidad, tipado, organización y alineación arquitectónica sin cambiar comportamiento funcional. úsala cuando se revisen archivos largos, lógica duplicada, responsabilidades mezcladas, naming deficiente, tipado ambiguo o deuda técnica estructural en frontend, backend, módulos compartidos o estructura de archivos.
---

# Domy Refactor Guard

Esta skill define el estándar de refactorización segura para todo el proyecto Domy. Su propósito es mejorar claridad, cohesión, mantenibilidad, tipado, organización y alineación arquitectónica sin alterar el comportamiento funcional del sistema.

## Flujo de trabajo
1. Revisar `references/refactor-principles.md`.
2. Revisar `references/safety-rules.md`.
3. Clasificar la deuda usando `references/debt-taxonomy.md`.
4. Si el caso es frontend, revisar `references/frontend-refactor-patterns.md`.
5. Si el caso es backend, revisar `references/backend-refactor-patterns.md`.
6. Si el cambio toca nombres o tipos, revisar `references/naming-and-typing.md`.
7. Confirmar límites de ejecución usando `references/execution-boundaries.md`.
8. Responder usando la estructura definida en `references/output-template.md`.
9. Si se requiere validar alineación básica del repositorio o del cambio, ejecutar `python3 scripts/verify_refactor.py`.

## Reglas obligatorias
- Nunca cambiar comportamiento funcional.
- No cambiar contratos externos sin autorización explícita.
- No mezclar refactor con feature nueva.
- No usar refactor para “corregir” comportamiento no solicitado.
- Priorizar claridad, cohesión y mantenibilidad sobre cleverness o compactación.
- Ejecutar solo cambios defendibles como reorganización interna segura.
- Marcar como recomendación cualquier cambio con duda funcional o contractual.

## Qué sí puede hacer
- extraer funciones
- extraer hooks
- extraer services
- dividir archivos grandes
- reorganizar módulos
- consolidar duplicación estable
- mejorar nombres
- mejorar tipado interno
- simplificar flujo lógico
- mover lógica a la capa correcta si el comportamiento se conserva

## Qué no puede hacer
- cambiar reglas de negocio
- alterar contratos externos sin necesidad
- modificar comportamiento de UI o API
- introducir nuevas features
- mezclar corrección funcional no solicitada con refactor estructural

## Regla final
Todo refactor debe mejorar al menos una dimensión real de calidad interna sin cambiar comportamiento observable.