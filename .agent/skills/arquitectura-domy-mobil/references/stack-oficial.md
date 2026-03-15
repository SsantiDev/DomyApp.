# Stack oficial — Domy en Mobil

## Objetivo
Este documento define el stack tecnológico oficial permitido para diseñar, validar o auditar arquitectura en Domy en Mobil. Toda propuesta debe mantenerse dentro de estas tecnologías, salvo solicitud explícita del usuario para evaluar una desviación.

## Stack permitido

### Frontend móvil
- React Native
- Expo
- TypeScript

### Backend
- Python
- Django
- Django REST Framework

### Base de datos servidor
- SQLite para desarrollo inicial o entornos locales
- PostgreSQL como base de datos objetivo para producción y escalabilidad

### Persistencia local móvil
- AsyncStorage para datos simples, livianos y no relacionales
- Expo SQLite para datos estructurados, consultas locales, colas offline y caché compleja

### Seguridad y autenticación
- JWT con SimpleJWT
- Validación de autorización en backend
- Protección de endpoints por autenticación y permisos

## Restricciones del stack
La skill no debe proponer por defecto tecnologías fuera del stack oficial, incluyendo pero no limitándose a:
- Firebase
- Supabase
- GraphQL
- Zustand
- Realm
- MongoDB
- Redis como dependencia obligatoria de arquitectura base
- servicios BaaS como reemplazo del backend Django

## Regla de desviación
Si el usuario solicita explícitamente evaluar una tecnología fuera del stack oficial:
1. Indicar claramente que se trata de una desviación.
2. Explicar el impacto técnico.
3. Comparar contra la solución oficial.
4. Recomendar la opción más alineada con mantenibilidad y consistencia del proyecto.

## Principios de uso del stack
- Mantener una sola base de código móvil para iOS y Android.
- Centralizar la lógica crítica en backend.
- Tratar PostgreSQL como destino natural de producción.
- Usar persistencia local solo como soporte operativo, nunca como fuente canónica.
- Mantener el tipado fuerte y la modularidad en frontend y backend.
- Diseñar pensando en crecimiento, resiliencia y mantenibilidad.

## Criterio de preferencia tecnológica
### Preferir AsyncStorage cuando:
- se guarden flags de UI
- se guarden preferencias simples
- se persistan datos pequeños de sesión o configuración
- no se requieran consultas complejas

### Preferir Expo SQLite cuando:
- se requieran tablas locales
- se necesiten colas offline
- se necesiten relaciones o filtros locales
- se gestione caché estructurada
- se requiera soporte robusto para sincronización diferida

### Preferir PostgreSQL cuando:
- exista información relacional de negocio
- se requiera consistencia transaccional
- existan reportes, auditoría o historial
- el dato deba ser canónico y compartido entre usuarios o dispositivos

## Regla final
Toda arquitectura propuesta por la skill debe intentar resolver el problema usando exclusivamente este stack antes de considerar alternativas.