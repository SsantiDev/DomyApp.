# Output template — Domy en Mobil

## Objetivo
Toda respuesta arquitectónica de la skill debe seguir esta estructura, adaptándola al caso solicitado.

---

## Plantilla obligatoria

### 1. Resumen de la solución
Explicar en pocas líneas la propuesta general, su intención y el criterio principal de diseño.

### 2. Objetivo funcional
Describir qué necesidad del negocio o del usuario resuelve la feature, módulo o flujo.

### 3. Capas involucradas
Listar las capas participantes:
- frontend móvil
- backend
- base de datos servidor
- persistencia local
- seguridad/autenticación

### 4. Responsabilidad por capa
Detallar qué hace cada capa y qué no debe hacer.

### 5. Flujo de datos
Explicar el recorrido de la información:
- origen del dato
- procesamiento
- validación
- persistencia
- respuesta al cliente
- sincronización si aplica

### 6. Persistencia requerida
Definir:
- qué vive en servidor
- qué puede vivir en AsyncStorage
- qué puede vivir en Expo SQLite
- cómo se sincroniza
- qué se considera estado canónico

### 7. Componentes o módulos involucrados
Enumerar componentes, pantallas, servicios, endpoints, serializers, modelos o módulos relevantes.

### 8. Endpoints requeridos
Proponer los endpoints mínimos necesarios si aplica.

### 9. Modelo de datos sugerido
Describir entidades, relaciones o atributos relevantes si aplica.

### 10. Reglas de seguridad
Indicar:
- autenticación requerida
- autorización requerida
- datos sensibles
- validaciones críticas
- riesgos de exposición

### 11. Riesgos técnicos y trade-offs
Explicar decisiones, compromisos y posibles limitaciones.

### 12. Recomendación final
Cerrar con una recomendación clara y accionable alineada con el stack oficial.

---

## Reglas de calidad de salida
La respuesta debe:
- evitar ambigüedad
- no mezclar responsabilidades entre capas sin justificarlo
- no proponer tecnologías fuera del stack sin marcar desviación
- señalar si hay supuestos
- incluir riesgos reales, no genéricos
- ser concreta y utilizable por un equipo técnico

## Regla adicional
Si el usuario pide validar una propuesta existente:
- comparar la propuesta contra el stack oficial
- identificar desacoples o riesgos
- indicar qué está bien, qué está mal y qué debe ajustarse

## Regla adicional para auditoría
Si el usuario pide auditar una arquitectura:
- detectar anti-patrones
- señalar duplicación de lógica
- revisar seguridad
- revisar persistencia
- revisar escalabilidad
- emitir veredicto final