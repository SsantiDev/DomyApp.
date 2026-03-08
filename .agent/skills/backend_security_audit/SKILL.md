---
name: "backend_security_audit"
description: "backend security and access audit guide for domy using django and drf. use when reviewing permissions, access scoping, sensitive data exposure, secret handling, serializer leakage, logs, and endpoint security posture."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Security
fecha_actualizacion: 2026-03-08
tags: [django, drf, security, permissions, secrets, auditing, access-control, privacy]
---
# Backend Security Audit

## Propósito
Esta skill define el estándar para auditar seguridad backend en Domy, con foco en permisos, scoping, exposición de datos, manejo de secretos y postura general de seguridad API.

## Cuándo aplicar esta skill
- revisión de permisos o autorización
- endpoints con datos sensibles
- dudas sobre ownership o scoping por usuario/tenant
- auditoría de serializers y campos expuestos
- detección de secretos o credenciales en código
- revisión de logs, trazas o mensajes de error
- evaluación de postura de seguridad de una feature

## Flujo del agente
1. Identificar el recurso sensible y su superficie de acceso.
2. Revisar autenticación, autorización y ownership.
3. Auditar serializers, logs y respuestas HTTP.
4. Detectar secretos, exposición innecesaria o bypasses.
5. Emitir hallazgos priorizados y correcciones.

## Reglas obligatorias

### Acceso y permisos
- siempre filtrar por `request.user`, tenant o contexto equivalente
- nunca confiar en IDs del cliente para acceso directo
- validar ownership o scope antes de devolver o mutar datos
- aplicar principio de mínimo privilegio

### Exposición de datos
- no serializar más campos de los necesarios
- revisar trazas, logs y mensajes de error para evitar fugas
- minimizar información sensible en respuestas y excepciones

### Secretos
- no permitir secretos, tokens o credenciales en código fuente
- si se detectan, detener flujo y exigir rotación
- mover configuración sensible a variables de entorno o secret manager

### Manejo de errores
- no revelar detalles internos innecesarios
- mantener mensajes útiles pero seguros
- separar diagnóstico interno de respuesta externa

## Anti-patrones prohibidos
- permisos superficiales o incompletos
- acceso a objetos por ID sin validar ownership
- serializers que filtran mal datos sensibles
- secretos hardcodeados
- logs con tokens, correos completos o payloads sensibles
- respuestas que revelan implementación interna sin necesidad

## Lógica de decisión

### Si el endpoint opera sobre recursos de usuario
- validar scoping por ownership antes de leer o escribir

### Si hay datos sensibles
- revisar serializer, logs, permisos y caching

### Si se detecta un secreto
- detener uso
- rotar
- externalizar
- revisar historial si aplica

### Si la tarea es auditoría
- devolver hallazgos priorizados por severidad: crítica, alta, media, baja

## Contrato de salida
1. superficie auditada
2. riesgo principal detectado
3. hallazgos por severidad
4. exposición de datos observada
5. estado de permisos y scoping
6. acciones correctivas inmediatas
7. recomendación final

## Formato de respuesta esperado

### Resumen
Qué endpoint, flujo o módulo se auditó.

### Hallazgos
Lista priorizada de problemas de seguridad.

### Exposición de datos
Qué información podría filtrarse o está mal protegida.

### Permisos y acceso
Cómo se valida o falla el control de acceso.

### Correcciones
Qué cambios deben aplicarse de inmediato.

### Recomendación final
La postura de seguridad esperada para Domy.