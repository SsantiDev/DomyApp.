# Safety rules — Domy Refactor Guard

## Objetivo
Definir las reglas de seguridad que preservan comportamiento durante cualquier refactor.

## Regla principal
Todo cambio debe poder describirse como reorganización interna segura.

## Validaciones obligatorias antes de ejecutar
Confirmar que:
1. inputs y outputs siguen siendo equivalentes
2. el flujo funcional no cambia
3. no se alteran reglas de negocio
4. no se modifica persistencia ni efectos de negocio
5. no cambia la semántica de errores o validaciones
6. no cambia API pública o contrato externo sin autorización explícita
7. el diff no mezcla refactor con feature nueva
8. el cambio puede aislarse en uno o varios commits atómicos

## Behavior preservation
- no cambiar comportamiento observable
- no cambiar contratos de uso sin necesidad
- no alterar side effects funcionales esperados
- no reordenar lógica sensible si puede afectar semántica
- si existe duda razonable sobre impacto, no ejecutar automáticamente

## Riesgo alto
Considerar de alto riesgo:
- cambios en navegación
- cambios en API pública
- cambios en contratos de serializers o responses
- cambios en reglas de dominio
- cambios en validaciones sensibles
- cambios en transacciones
- cambios en side effects encadenados

## Regla de bloqueo
Si un refactor necesita cambiar comportamiento para “quedar mejor”, no debe ejecutarse como refactor seguro.

## Regla de recomendación
Los cambios con riesgo funcional o contractual deben quedar como recomendación separada, no como refactor ejecutado.