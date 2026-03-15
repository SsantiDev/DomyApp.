# Execution boundaries — Domy Refactor Guard

## Objetivo
Definir qué sí puede ejecutar automáticamente la skill y qué debe dejar como recomendación.

## Puede ejecutar automáticamente
- extracción de funciones privadas
- extracción de helpers internos
- extracción de hooks internos
- división de archivos grandes cuando la separación sea clara
- reorganización interna de módulos
- simplificación de flujo lógico
- mejora de naming interno
- mejora de tipado interno
- consolidación de duplicación estable
- mover lógica a la capa correcta cuando el contrato se preserve

## No puede ejecutar automáticamente
- cambios de reglas de negocio
- cambios en comportamiento visible
- cambios en UX observable
- cambios en navegación pública
- cambios en API pública
- cambios en contratos externos
- cambios en validaciones sensibles con posible impacto funcional
- cambios que requieran reinterpretar requisitos del negocio

## Debe dejar como recomendación
- refactors de alto riesgo
- cambios que mejoren diseño pero afecten compatibilidad
- simplificaciones que alteren semántica
- unificación excesiva de módulos que aún no muestran patrón estable
- reescrituras grandes que no puedan aislarse de forma segura

## Regla de atomicidad
Separar refactors por intención.  
No mezclar renaming, extracción, relocalización y cambios de lógica si eso aumenta riesgo o dificulta revisión.

## Regla final
Si el cambio no puede defenderse como seguro, atómico y behavior-preserving, no debe ejecutarse automáticamente.