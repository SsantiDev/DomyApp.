# Debt taxonomy — Domy

## Objetivo
Clasificar de forma consistente la deuda técnica detectada durante una auditoría de refactor.

## Categorías principales

### Duplicación
- lógica repetida
- estructuras repetidas con intención equivalente
- validaciones clonadas
- parsing o transformación repetida

### Baja cohesión
- archivo con demasiados motivos de cambio
- función con tareas mezcladas
- componente con UI, networking y reglas en el mismo lugar
- service con responsabilidades no relacionadas

### Demasiadas responsabilidades
- una unidad mezcla coordinación, transformación, validación y presentación
- un archivo hace demasiado para una sola abstracción

### Naming deficiente
- nombres ambiguos
- nombres demasiado genéricos
- nombres que describen implementación accidental en lugar de intención
- abreviaciones crípticas

### Capa incorrecta
- lógica de negocio en UI
- networking en componente visual
- dominio incrustado en serializer o view
- reglas sensibles fuera de backend o fuera de su capa correcta

### Complejidad innecesaria
- nesting profundo
- condicionales difíciles de seguir
- ramas duplicadas
- estructuras demasiado compactas o demasiado abstractas

### Tipado deficiente
- any innecesario
- tipos poco expresivos
- contratos ambiguos
- interfaces incompletas o poco precisas

### Estructura pobre
- archivo excesivamente largo
- módulos mal ubicados
- carpetas incoherentes
- falta de separación entre responsabilidades

### Acoplamiento excesivo
- dependencias cruzadas innecesarias
- conocimiento excesivo entre módulos
- componentes que dependen de demasiados detalles internos

## Regla
Toda auditoría debe clasificar explícitamente la deuda detectada usando una o más de estas categorías.