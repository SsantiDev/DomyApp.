# Merge flow — Git Protocol

## Objetivo
Definir el flujo obligatorio para integrar ramas atómicas a `develop`.

## Flujo obligatorio
1. Confirmar que el bloque atómico ya fue committeado en su rama.
2. Hacer push de la rama remota.
3. Cambiar a `develop`.
4. Actualizar `develop` con el remoto si aplica.
5. Ejecutar el merge de la rama atómica.
6. Verificar el estado posterior al merge.
7. Confirmar que no quedaron conflictos ni cambios inconsistentes.
8. Confirmar que el commit quedó visible en la historia de `develop`.
9. Si el merge fue exitoso, eliminar la rama local.
10. Eliminar la rama remota.
11. Continuar con el siguiente bloque atómico.

## Verificaciones posteriores al merge
- `git status` limpio o consistente
- rama `develop` activa
- commit visible en historial de `develop`
- ausencia de conflictos pendientes
- ausencia de cambios colaterales inesperados

## Regla de seguridad
Si el merge falla o hay conflictos:
- detener eliminación de rama
- resolver el problema en la rama correspondiente
- no continuar con nuevos bloques hasta estabilizar el merge actual

## Regla final
Una rama solo puede eliminarse después de confirmar que su contenido quedó correctamente integrado en `develop`.