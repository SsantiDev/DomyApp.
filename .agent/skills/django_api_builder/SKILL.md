---
name: "django_api_builder"
description: "django rest framework implementation guide for domy. use when designing or reviewing serializers, viewsets, permissions, endpoint contracts, validation flow, error semantics, and secure http orchestration."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: API Delivery
fecha_actualizacion: 2026-03-08
tags: [django, drf, serializers, viewsets, permissions, api, endpoints, http]
---
# Django API Builder

## Propósito
Esta skill define el estándar para construir APIs en Domy con Django REST Framework, con foco en endpoints explícitos, validaciones correctas, permisos robustos y contratos HTTP claros.

## Cuándo aplicar esta skill
- creación o modificación de serializers
- diseño de endpoints o contratos request/response
- implementación de viewsets, mixins o acciones custom
- cambios en permisos, autenticación o autorización
- revisión de respuestas HTTP y manejo de errores
- refactorización de la capa DRF

## Flujo del agente
1. Identificar recurso, acción y contrato esperado.
2. Definir serializer, permisos y view apropiados.
3. Separar validación de entrada, orquestación HTTP y lógica de negocio.
4. Revisar exposición de campos y seguridad del endpoint.
5. Emitir diseño final con errores semánticos y tests.

## Reglas obligatorias

### Serializers
- tipar y definir campos de forma explícita
- usar `read_only_fields` donde corresponda
- aplicar validaciones por campo y de objeto para reglas cruzadas
- no exponer campos sensibles sin necesidad
- no meter lógica de dominio pesada en serializer si pertenece a services

### Views y ViewSets
- preferir `GenericViewSet` con mixins específicos
- evitar CRUD excesivo por defecto
- usar acciones custom solo si el comportamiento no encaja en operaciones estándar
- mantener las views enfocadas en orquestación HTTP

### Permisos
- validar autenticación y autorización antes de ejecutar flujos sensibles
- aplicar scoping por usuario, tenant o contexto
- no confiar en IDs o flags del cliente sin validación de ownership

### HTTP y errores
- devolver códigos HTTP semánticos
- no esconder errores de negocio detrás de 500
- usar mensajes de error claros para cliente y seguros para producción
- mantener contratos request/response explícitos y estables

## Anti-patrones prohibidos
- serializers gigantes con demasiada lógica
- viewsets que exponen más de lo necesario
- permisos implícitos o incompletos
- respuestas ambiguas o inconsistentes
- lógica de negocio central en la capa HTTP
- confiar en datos del request sin validación de acceso

## Lógica de decisión

### Si el flujo es CRUD simple
- usar mixins específicos y serializer claro

### Si el flujo es transaccional o de dominio
- delegar lógica a services y dejar la view como orquestadora

### Si hay datos sensibles
- revisar campos serializados, permisos y ownership

### Si la acción no es estándar
- evaluar `@action` o endpoint dedicado con contrato explícito

## Contrato de salida
1. objetivo del endpoint
2. serializers involucrados
3. permisos y scoping
4. contrato request/response
5. manejo de errores
6. riesgos de exposición o acoplamiento
7. tests requeridos
8. recomendación final

## Formato de respuesta esperado

### Resumen
Qué endpoint o flujo HTTP se construye o audita.

### Diseño propuesto
Serializers, views, permisos y acciones involucradas.

### Seguridad
Cómo se controla autenticación, autorización y exposición.

### Contrato API
Qué entra, qué sale y qué errores se esperan.

### Testing
Qué pruebas deben proteger el endpoint.

### Recomendación final
La implementación DRF más clara y segura para Domy.