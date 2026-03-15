# Decision rules — Domy en Mobil

## Objetivo
Este documento define reglas operativas para decidir dónde ubicar responsabilidades técnicas dentro de la arquitectura oficial de Domy en Mobil.

## Regla principal
La decisión arquitectónica debe favorecer:
- separación clara de responsabilidades
- seguridad
- consistencia de datos
- facilidad de mantenimiento
- tolerancia a conectividad inestable
- escalabilidad futura

## 1. Frontend vs backend

### Llevar al frontend cuando:
- la responsabilidad sea puramente visual o de interacción
- se maneje estado de pantalla o navegación
- se muestre feedback inmediato al usuario
- se haga validación básica de experiencia de usuario
- se gestione caché visual o sesión local no crítica

### Llevar al backend cuando:
- exista lógica de negocio
- haya cálculos críticos
- haya validaciones obligatorias
- se deban aplicar permisos o reglas por rol
- exista integridad transaccional
- haya decisiones que afecten otros usuarios o módulos
- el sistema deba protegerse frente a manipulación del cliente

## 2. Fuente de verdad

### Regla canónica
El estado canónico siempre vive en el servidor.

### Implicaciones
- la app móvil puede cachear, predecir o encolar
- la app móvil no debe definir la verdad final del negocio
- si existe discrepancia entre local y servidor, el servidor prevalece
- toda estrategia offline debe diseñarse para reconciliación posterior

## 3. Validaciones

### Validaciones de frontend
Se usan para:
- mejorar UX
- prevenir errores obvios
- reducir round trips innecesarios

### Validaciones de backend
Son obligatorias para:
- seguridad
- integridad
- reglas de negocio
- autorización
- consistencia de estados
- validación transaccional

### Regla
Ninguna validación crítica debe existir solo en frontend.

## 4. Persistencia local

### Usar almacenamiento local cuando:
- el dato ayude a la continuidad de experiencia
- se requiera resiliencia offline
- el acceso rápido mejore UX
- exista necesidad de cola de sincronización

### No usar almacenamiento local como sustituto del servidor cuando:
- el dato sea sensible
- el dato sea compartido entre múltiples usuarios o dispositivos
- el dato defina estados críticos del negocio
- se requiera consistencia global

## 5. Offline-first

### Aplicar estrategia offline-first cuando:
- la conectividad sea una limitación esperable
- el usuario necesite continuidad operativa
- la acción pueda capturarse localmente y sincronizarse después

### No aplicar offline-first pleno cuando:
- la operación requiera confirmación inmediata del servidor
- el riesgo de conflicto sea alto
- la operación comprometa pagos, permisos o estados irreversibles

## 6. Consistencia transaccional

### Requiere backend y base de datos servidor cuando:
- haya cambios múltiples que deban aplicarse juntos
- una falla parcial pueda romper la integridad
- existan pagos, agendamientos, reservas o estados encadenados
- se requiera historial auditable

## 7. Seguridad

### Toda responsabilidad sensible debe vivir en backend:
- autorización
- cálculo de montos
- definición de permisos
- acceso a datos restringidos
- validación de identidad
- emisión de estados finales del negocio

## 8. Criterio de decisión rápida

### Si afecta principalmente:
- interfaz o navegación → frontend
- reglas, cálculos, permisos o integridad → backend
- datos simples locales → AsyncStorage
- datos locales estructurados o colas → Expo SQLite
- consistencia canónica → PostgreSQL o base servidor
- autenticación o sesión → JWT + validación backend

## 9. Regla de conflicto
Si una responsabilidad parece pertenecer a dos capas:
1. ubicar la versión canónica en backend
2. dejar en frontend solo adaptación, presentación o anticipación de UX
3. documentar el trade-off

## 10. Regla final de diseño
Ante dudas, preferir la opción que:
- reduzca acoplamiento
- evite duplicación de reglas
- proteja integridad del negocio
- mantenga la app móvil liviana
- conserve al backend como centro de verdad