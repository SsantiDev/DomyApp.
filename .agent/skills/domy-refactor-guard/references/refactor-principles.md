# Refactor principles — Domy

## Objetivo
Definir los principios base que deben gobernar cualquier refactor dentro de Domy.

## Principio rector
Un refactor solo es válido si mejora al menos una de estas dimensiones sin cambiar comportamiento funcional:
- claridad
- cohesión
- mantenibilidad
- testabilidad
- alineación arquitectónica
- reducción de duplicación
- legibilidad del flujo lógico

## Regla máxima
Nunca cambiar el comportamiento funcional.

## Filosofía
Preferir siempre:
- claridad sobre cleverness
- expresividad sobre brevedad
- cohesión sobre compactación
- guard clauses sobre nesting profundo
- nombres claros sobre abreviaciones ingeniosas
- cambios atómicos sobre grandes reescrituras
- arquitectura correcta sobre hacks locales

## Regla de valor
No refactorizar por estética, moda o gusto personal.  
Solo refactorizar cuando exista una mejora estructural real.

## Regla de longitud
Código largo no implica mal código.  
Solo refactorizar por longitud si la longitud oculta responsabilidades mezcladas, complejidad o baja cohesión.

## Regla de simplicidad
No asumir que menos líneas significa mejor código.  
No asumir que más abstracción significa mejor diseño.

## Regla de límite
Si un cambio “se ve mejor” pero introduce duda funcional, no ejecutarlo.