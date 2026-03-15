# Backend refactor patterns — Domy

## Objetivo
Definir patrones seguros de refactor para backend Django y Django REST Framework.

## Refactors recomendados
- extraer service
- extraer función privada
- mover lógica compleja fuera de views
- mover lógica de dominio fuera de serializers cuando aplique
- simplificar ramas condicionales
- consolidar duplicación entre servicios o utilidades
- mejorar naming de métodos, variables y clases
- dividir archivos con responsabilidades mezcladas
- aislar reglas de negocio por responsabilidad

## Señales de refactor
- view demasiado larga
- serializer con demasiada lógica de negocio
- service que mezcla varias responsabilidades
- lógica repetida entre endpoints
- validaciones duplicadas
- funciones con múltiples niveles de branching
- managers o queries con intención confusa

## Regla de capas
- HTTP en views
- validación estructural en serializers
- dominio complejo en services o capa de dominio
- queries especializadas en su lugar adecuado
- seguridad y permisos donde corresponda

## Anti-patrones
- mover lógica sin aclarar intención
- dispersar una regla de negocio en demasiados archivos
- abstraer antes de entender el patrón
- reorganizar dominio y contrato HTTP al mismo tiempo

## Regla final
El backend debe quedar más claro y más coherente por capas, sin alterar semántica funcional ni contratos expuestos.