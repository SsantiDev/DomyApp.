# Conflict and failure policy — Git Protocol

## Objetivo
Definir cómo reaccionar ante errores, conflictos o fallos durante el flujo.

## Si falla la validación previa
- no commitear
- corregir el bloque
- volver a validar
- no crear historial sucio por prisa

## Si falla el commit
- revisar stage actual
- revisar mensaje de commit
- confirmar que existen cambios staged reales
- corregir el problema antes de reintentar

## Si falla el push
- no asumir integración
- revisar rama remota, autenticación o conectividad
- conservar la rama local hasta resolver
- no borrar la rama local

## Si falla el merge
- no borrar la rama
- resolver conflicto o inconsistencia
- verificar nuevamente antes de continuar
- mantener `develop` estable como prioridad

## Si el bloque tiene riesgo de mezcla
- dividirlo en bloques más pequeños
- volver al stage selectivo
- no forzar un commit grande por conveniencia

## Si se detectan cambios funcionales dudosos
- no continuar automáticamente
- reportar el riesgo
- separar recomendación de ejecución

## Si el historial queda inconsistente
- detener el flujo
- revisar rama actual
- revisar último commit
- revisar estado de `develop`
- corregir antes de seguir con el siguiente bloque

## Regla final
Ante conflicto o duda, preservar trazabilidad, reversibilidad y estabilidad antes que velocidad.