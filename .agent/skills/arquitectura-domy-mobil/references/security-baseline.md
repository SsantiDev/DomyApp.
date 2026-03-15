# Security baseline — Domy en Mobil

## Objetivo
Definir una línea base de seguridad para decisiones arquitectónicas dentro de Domy en Mobil.

## Principios
- nunca confiar en el cliente como autoridad
- proteger identidad, sesión y datos sensibles
- minimizar exposición de información
- validar toda operación sensible en backend
- diseñar seguridad como parte de la arquitectura, no como parche

## 1. Autenticación
La autenticación oficial se basa en JWT usando SimpleJWT.

### Reglas
- emitir tokens desde backend
- validar tokens en cada request protegida
- manejar expiración y refresh de forma explícita
- separar autenticación de autorización

## 2. Autorización
Toda autorización debe resolverse en backend.

### Revisar siempre:
- quién es el usuario
- qué rol tiene
- si es dueño del recurso
- en qué estado está el recurso
- si la acción está permitida en ese contexto

## 3. Almacenamiento de tokens
Los tokens deben almacenarse de forma segura según la política del proyecto.

### Reglas mínimas
- no almacenar secretos en texto plano inseguro
- minimizar persistencia innecesaria
- evitar exposición en logs
- limpiar tokens al cerrar sesión o invalidar sesión

## 4. Protección de endpoints
Todo endpoint sensible debe:
- requerir autenticación si aplica
- validar permisos
- validar payload
- evitar exposición excesiva de datos
- responder con errores controlados

## 5. Datos sensibles
### Minimizar exposición de:
- tokens
- datos personales innecesarios
- identificadores internos sensibles
- información de seguridad
- mensajes de error que revelen demasiado contexto interno

## 6. Validación en backend
El backend debe validar:
- identidad
- permisos
- reglas de negocio
- transiciones de estado
- consistencia de relaciones
- restricciones críticas

## 7. Logging y observabilidad
### Reglas
- no registrar tokens completos
- no registrar contraseñas
- no registrar secretos
- sanitizar datos sensibles
- registrar solo lo necesario para auditoría y diagnóstico

## 8. Seguridad en flujos móviles
### Considerar:
- mala conectividad
- reintentos automáticos
- expiración de sesión
- uso de caché
- sincronización posterior
- cierre de sesión ante credenciales inválidas o revocadas

## 9. Anti-patrones
- confiar en validaciones del frontend como control suficiente
- exponer reglas sensibles al cliente como autoridad final
- devolver más datos de los necesarios
- guardar credenciales en texto plano
- permitir transiciones críticas solo por confianza en el payload del cliente

## 10. Criterio de seguridad por defecto
Si una decisión genera duda, elegir la opción que:
- concentre control en backend
- reduzca superficie de exposición
- minimice datos sensibles en cliente
- haga explícitos permisos y validaciones

## 11. Regla final
Toda propuesta arquitectónica debe incluir una sección de seguridad cuando:
- haya autenticación
- haya sesión
- haya permisos
- haya datos personales
- haya operaciones críticas
- haya sincronización offline con impacto de negocio