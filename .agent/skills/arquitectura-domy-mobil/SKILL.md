---
name: arquitectura-domy-mobil
description: diseña, valida y audita arquitectura técnica de domy en mobil usando react native con typescript, django rest framework, postgresql, persistencia local móvil y jwt. úsala cuando se necesite decidir responsabilidades por capa, flujos de datos, persistencia offline-first, seguridad, módulos, endpoints o trade-offs técnicos dentro del stack oficial.
---

# Arquitectura Domy en Mobil

Esta skill define y aplica la arquitectura oficial de Domy en Mobil para asegurar consistencia técnica, escalabilidad, seguridad y mantenibilidad en decisiones de producto y desarrollo.

## Flujo de trabajo
1. Revisar `references/stack-oficial.md`.
2. Aplicar `references/decision-rules.md`.
3. Si la solicitud involucra endpoints, contratos o diseño API, revisar `references/api-guidelines.md`.
4. Si la solicitud involucra persistencia local, caché o soporte offline, revisar `references/mobile-storage.md`.
5. Si la solicitud involucra autenticación, permisos o datos sensibles, revisar `references/security-baseline.md`.
6. Responder usando la estructura definida en `references/output-template.md`.
7. Si se requiere validar alineación técnica del proyecto o del repositorio, ejecutar `python3 scripts/verify_arch.py`.

## Reglas obligatorias
- Mantenerse dentro del stack oficial salvo solicitud explícita del usuario para evaluar una desviación.
- No mover lógica crítica de negocio al frontend.
- Tratar el backend como fuente de verdad.
- Justificar cualquier uso de persistencia local.
- Señalar riesgos, trade-offs y supuestos cuando existan.
- No proponer tecnologías fuera del stack oficial sin marcar claramente el impacto técnico.

## Stack oficial
- Frontend móvil: React Native con Expo y TypeScript
- Backend: Django + Django REST Framework
- Base de datos servidor: SQLite en desarrollo inicial y PostgreSQL como target productivo
- Persistencia local móvil: AsyncStorage o Expo SQLite
- Seguridad y autenticación: JWT con SimpleJWT

## Criterios de decisión rápida
- Si el cambio afecta experiencia visual, navegación o interacción: frontend.
- Si el cambio afecta reglas, validaciones, permisos, cálculos o integridad: backend.
- Si requiere consistencia transaccional o estado canónico: base de datos servidor.
- Si requiere resiliencia offline o respuesta rápida local: AsyncStorage o Expo SQLite según complejidad.
- Si involucra identidad, sesión o autorización: JWT + validación backend.

## Qué debe incluir toda respuesta
Toda respuesta arquitectónica debe incluir, cuando aplique:
- resumen de la solución
- objetivo funcional
- capas involucradas
- responsabilidad por capa
- flujo de datos
- persistencia requerida
- componentes o módulos involucrados
- endpoints requeridos
- modelo de datos sugerido
- reglas de seguridad
- riesgos y trade-offs
- recomendación final

## Regla final
Favorecer siempre:
- modularidad
- separación de responsabilidades
- mantenibilidad a largo plazo
- facilidad de pruebas
- tolerancia a mala conectividad
- crecimiento progresivo del sistema