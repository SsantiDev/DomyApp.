# Naming and typing — Domy

## Objetivo
Definir criterios de mejora para nombres, tipos y contratos internos durante refactors seguros.

## Naming
### Mejorar cuando:
- el nombre sea ambiguo
- el nombre sea demasiado genérico
- el nombre no exprese intención
- el nombre sea engañoso respecto a lo que hace la unidad
- exista inconsistencia con el resto del proyecto

### Preferir
- nombres que expresen intención
- nombres alineados con el dominio
- nombres consistentes con la convención existente
- verbos claros para acciones
- sustantivos claros para entidades y estructuras

### Evitar
- abreviaciones crípticas
- nombres tipo data, temp, item, value sin contexto
- renombres públicos innecesarios
- cambios masivos de naming mezclados con lógica

## Tipado
### Mejorar cuando:
- exista any innecesario
- el contrato sea ambiguo
- falten tipos de props, responses, requests o estructuras
- el tipo actual no comunique intención

### Preferir
- tipos explícitos y legibles
- contratos internos claros
- interfaces o types bien nombrados
- restricciones de tipo que reduzcan ambigüedad real

### Evitar
- complejidad de tipos que empeore comprensión
- refactors de typing que cambien comportamiento
- cambios públicos innecesarios solo por perfeccionismo

## Regla final
Mejorar nombres y tipos solo cuando la intención quede más clara sin introducir riesgo contractual o funcional.