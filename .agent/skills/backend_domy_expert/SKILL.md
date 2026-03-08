---
name: "backend_domy_expert"
description: "backend architecture guide for domy using django, django rest framework, and postgresql. use when planning, reviewing, or coordinating backend work across domain modeling, transactions, api design, queries, permissions, migrations, and secure service behavior."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Core Integrity
fecha_actualizacion: 2026-03-08
tags: [django, drf, postgresql, backend, architecture, security, scaling, integrity]
---
# Backend Domy Expert

## Propósito
Esta skill es la guía madre del backend de Domy. Define principios transversales y decide qué skill especializada debe aplicarse según el tipo de intervención.

## Cuándo aplicar esta skill
- cuando se necesite diseñar o revisar arquitectura backend general
- cuando una tarea afecte varias capas del backend al mismo tiempo
- cuando se deba decidir si un problema pertenece a dominio, API, queries o seguridad
- cuando se requiera una recomendación global antes de implementar

## Stack oficial
- Django
- Django REST Framework
- PostgreSQL

## Principios transversales
- preservar integridad de datos por encima de conveniencia de implementación
- mantener separación clara entre dominio, persistencia y HTTP
- centralizar reglas críticas en backend
- diseñar para escalabilidad, auditabilidad y seguridad
- evitar duplicación de lógica entre views, serializers y services
- proteger siempre datos sensibles y accesos por contexto
- preferir soluciones explícitas y testeables

## Derivación a skills hijas

### Usar `backend_domain_integrity` cuando:
- se diseñen o modifiquen modelos
- haya migraciones, constraints o cambios de dominio
- existan operaciones multi-entidad
- se necesite revisar atomicidad, rollback o consistencia

### Usar `django_api_builder` cuando:
- se diseñen endpoints
- se creen serializers, viewsets o permisos
- se definan respuestas HTTP y contratos API
- se refactorice la capa DRF

### Usar `backend_query_performance` cuando:
- haya problemas de N+1
- se revisen listados, joins o paginación
- se necesiten índices o tuning de queries
- existan dudas sobre `select_related`, `prefetch_related` o locking

### Usar `backend_security_audit` cuando:
- se revisen permisos o scoping
- existan datos sensibles
- se audite exposición de información
- se detecten secretos, credenciales o flujos inseguros

## Flujo del agente
1. Identificar el tipo principal de problema.
2. Detectar si afecta una sola sub-área o varias.
3. Aplicar la skill hija principal.
4. Si hay impacto transversal, complementar con otra skill hija.
5. Emitir una recomendación consolidada.

## Reglas globales
- no confiar en datos críticos enviados por el cliente
- no dejar lógica de dominio compleja en la capa HTTP
- no introducir migraciones o queries riesgosas sin análisis
- no exponer información sensible por defecto
- no cerrar una intervención sin impacto en tests, seguridad y rendimiento

## Contrato de salida
Toda respuesta debe terminar con:
1. área backend principal afectada
2. skills hijas aplicables
3. riesgos transversales detectados
4. recomendación de implementación
5. validaciones obligatorias antes de cerrar el cambio

