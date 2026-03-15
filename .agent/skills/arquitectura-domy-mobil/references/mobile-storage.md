## Objetivo
Definir criterios para el uso correcto de persistencia local en la app móvil de Domy en Mobil.

## Principio base
El almacenamiento local es un soporte operativo de la aplicación móvil. No reemplaza la verdad del servidor.

## Objetivos del almacenamiento local
- mantener sesión
- mejorar tiempos de respuesta percibidos
- soportar experiencia offline o intermitente
- cachear datos consultados frecuentemente
- registrar acciones pendientes de sincronización

## 1. AsyncStorage

### Usar AsyncStorage para:
- preferencias de usuario
- flags de onboarding
- configuraciones simples
- datos pequeños de sesión no sensibles según política del proyecto
- caché ligera de claves simples

### No usar AsyncStorage para:
- estructuras relacionales
- colas complejas
- consultas filtradas complejas
- almacenamiento crítico de negocio
- secretos o credenciales en texto plano

## 2. Expo SQLite

### Usar Expo SQLite para:
- caché estructurada
- listas complejas consultables offline
- colas de sincronización
- borradores locales
- entidades locales con timestamp, estado y sincronización posterior
- consultas locales que requieran filtros o relaciones

### Casos típicos
- trabajos pendientes de enviar
- agenda descargada parcialmente
- catálogos sincronizados
- datos operativos con modo offline

## 3. Qué no debe guardarse solo en local
- estados finales del negocio
- pagos confirmados
- decisiones de autorización
- historial canónico
- credenciales o secretos inseguros
- datos cuya pérdida o manipulación comprometa el negocio

## 4. Estrategia de caché

### Reglas
- definir tiempo o criterio de invalidez
- guardar timestamp de última actualización
- distinguir entre dato cacheado y dato sincronizado
- permitir refresco desde servidor cuando haya conectividad
- documentar qué pantallas pueden usar datos stale y cuáles no

## 5. Estrategia offline

### Patrón recomendado
1. capturar acción localmente
2. marcar estado como pendiente
3. almacenar timestamp y metadata mínima
4. intentar sincronización cuando vuelva la conectividad
5. actualizar estado local según respuesta del servidor

### Estados sugeridos
- pending
- synced
- failed
- conflict

## 6. Manejo de conflictos
Cuando una acción local compita con el estado remoto:
- el servidor define la resolución final
- el cliente debe poder marcar conflicto
- el flujo debe permitir reintento o intervención del usuario cuando aplique

## 7. Diseño de sincronización

### Recomendaciones
- usar identificadores estables
- guardar `updated_at` o equivalente
- mantener un campo de estado de sincronización
- registrar intentos y errores cuando el flujo lo amerite
- evitar sincronizaciones silenciosas que oculten fallos importantes

## 8. Seguridad local
- minimizar el almacenamiento de información sensible
- no guardar secretos en texto plano
- limitar exposición de tokens y credenciales
- proteger la sesión según la política de seguridad del proyecto

## 9. Regla de decisión rápida
- dato simple y pequeño → AsyncStorage
- dato estructurado y consultable → Expo SQLite
- dato crítico o canónico → servidor
- acción pendiente por mala red → cola local + sincronización posterior

## 10. Regla final
Toda persistencia local debe justificarse por una de estas razones:
- continuidad de experiencia
- tolerancia a mala conectividad
- rendimiento percibido
- soporte transitorio hasta sincronización con backend