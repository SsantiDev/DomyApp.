---
name: "arquitectura_domy_mobil"
description: "Arquitecto de software para Domy en Mobil. Usa esta skill cuando se necesite diseñar, validar o auditar arquitectura técnica de features, módulos o flujos del proyecto usando React Native con TypeScript, Django REST Framework, PostgreSQL, almacenamiento local móvil y autenticación JWT."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Desarrollo
fecha_actualizacion: 2026-03-08
tags: [skill, arquitectura, react-native, typescript, django, drf, postgresql, jwt, mobile, offline-first]
---
# Arquitectura Oficial — Domy en Mobil

## Propósito
Esta skill define y aplica la arquitectura oficial del proyecto Domy en Mobil para asegurar consistencia técnica, escalabilidad, seguridad y mantenibilidad en todas las decisiones de producto y desarrollo.

## Stack oficial
- Frontend móvil: React Native (Expo) + TypeScript
- Backend: Django + Django REST Framework
- Base de datos actual: SQLite (con miras a migración a PostgreSQL en producción)
- Persistencia local móvil: AsyncStorage o SQLite (vía Expo SQLite)
- Seguridad y autenticación: JWT con SimpleJWT

## Principios arquitectónicos
1. Mantener una sola base de código móvil para iOS y Android.
2. Centralizar la lógica de negocio en el backend.
3. Usar SQLite para desarrollo inicial y PostgreSQL para entornos escalables.
4. Usar persistencia local en móvil solo para caché, sesión o soporte offline.
5. Proteger todos los flujos sensibles con autenticación basada en JWT.
6. Favorecer diseño modular, tipado fuerte y separación clara de responsabilidades.
7. Diseñar pensando en crecimiento nacional, mantenibilidad y resiliencia ante mala conectividad.

## Responsabilidades por capa

### 1. Capa de Presentación (Frontend Móvil)
Tecnología base:
- React Native
- TypeScript

Responsabilidades:
- renderizar interfaz de usuario
- gestionar navegación
- manejar estado local y estado global
- consumir endpoints del backend
- mostrar feedback inmediato al usuario
- manejar caché de interfaz y persistencia de sesión local

Convenciones:
- usar componentes modulares y reutilizables
- usar Hooks para lógica de UI
- usar Context API o Redux cuando el estado sea compartido o complejo
- mantener la lógica de negocio fuera de la UI
- no duplicar reglas críticas que pertenecen al backend

Anti-patrones:
- cálculos de negocio sensibles en el cliente
- validaciones críticas solo del lado móvil
- componentes gigantes con demasiada lógica
- mezclar networking, estado y render en un mismo componente

### 2. Capa de Lógica de Negocio (Backend)
Tecnología base:
- Django
- Django REST Framework

Responsabilidades:
- autenticación y autorización
- reglas de negocio
- cálculo de pagos
- gestión de calendarios
- validación transaccional
- exposición de endpoints seguros
- orquestación de procesos del sistema

Convenciones:
- toda regla crítica debe vivir en backend
- los endpoints deben ser explícitos, versionables y seguros
- separar serializers, views, services y lógica de dominio cuando aplique
- diseñar pensando en futura expansión y escalabilidad

Anti-patrones:
- meter lógica compleja solo en views
- confiar en datos del cliente sin validación
- exponer endpoints ambiguos o sobrecargados
- duplicar lógica en múltiples capas sin necesidad

### 3. Capa de Persistencia de Datos
Tecnología base:
- SQLite (actual) / PostgreSQL (target)
- AsyncStorage o Expo SQLite en el dispositivo

Responsabilidades:
- Servidor: Datos relacionales, transaccionales, históricos y consistentes.
- Almacenamiento local: Sesión, caché, colas temporales, soporte offline y datos de acceso rápido.

Reglas:
- El estado canónico vive en la base de datos del servidor.
- El almacenamiento local nunca reemplaza la verdad del servidor.
- Sincronizar datos locales con backend cuando la conectividad lo permita.
- Preferir Expo SQLite cuando se necesiten estructuras locales más robustas o consultas complejas.
- Preferir AsyncStorage para datos simples de sesión o configuración.

Anti-patrones:
- guardar datos críticos solo en local
- tratar la caché como fuente de verdad
- no definir estrategia de invalidación o sincronización

### 4. Capa de Seguridad
Tecnología base:
- JWT con SimpleJWT

Responsabilidades:
- autenticación de usuarios
- control de acceso
- validación de cada request protegida
- protección de sesiones
- resguardo de credenciales y tokens

Reglas:
- almacenar tokens de forma segura en el cliente
- validar cada request protegida en backend
- aplicar middleware o mecanismos equivalentes para verificación de acceso
- minimizar exposición de datos sensibles
- proteger endpoints según roles y contexto

Anti-patrones:
- guardar secretos o credenciales en texto plano
- confiar únicamente en protección del frontend
- exponer información sensible en respuestas innecesarias

## Decision framework
Cuando se solicite diseñar o validar una feature, responde siempre usando este orden:

1. **Validación Pre-Vuelo**: Ejecutar `python3 .agent/skills/ARQUITECTURA/scripts/verify_arch.py` para asegurar que el entorno cumple con los estándares.
2. Objetivo funcional
3. Capas involucradas
3. Responsabilidad por capa
4. Flujo de datos
5. Persistencia requerida
6. Reglas de seguridad
7. Riesgos técnicos
8. Recomendación final

## Output contract
Toda respuesta arquitectónica debe incluir, cuando aplique:

- Resumen de la solución
- Distribución por capas
- Componentes o módulos involucrados
- Endpoints requeridos
- Modelo de datos sugerido
- Estrategia de persistencia local vs servidor
- Consideraciones de seguridad
- Riesgos y trade-offs
- Recomendación final

## Criterios de decisión
- Si el cambio afecta experiencia visual o interacción: frontend
- Si el cambio afecta reglas, validaciones, cálculos o integridad: backend
- Si requiere consistencia transaccional: PostgreSQL
- Si requiere resiliencia offline o respuesta rápida local: AsyncStorage o SQLite
- Si involucra identidad, sesión o permisos: JWT + validación backend

## Escalabilidad
Toda propuesta debe favorecer:
- modularidad
- separación de responsabilidades
- crecimiento nacional
- facilidad de pruebas
- mantenibilidad a largo plazo
- tolerancia a mala conectividad

## Instrucción final
No propongas tecnologías fuera del stack oficial salvo que el usuario lo solicite explícitamente. Si una propuesta se desvía del stack oficial, indícalo con claridad y explica el impacto técnico.