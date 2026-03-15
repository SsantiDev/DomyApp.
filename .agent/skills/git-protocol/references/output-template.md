# Output template — Git Protocol

## Objetivo
Toda ejecución del flujo Git debe reportarse con una estructura clara y verificable.

## Plantilla obligatoria

### 1. Bloque atómico identificado
Describir el propósito concreto del bloque.

### 2. Tipo de cambio
Indicar el tipo de Conventional Commit aplicado.

### 3. Rama creada
Indicar el nombre exacto de la rama.

### 4. Archivos incluidos
Listar los archivos staged del bloque.

### 5. Commit generado
Indicar el mensaje exacto del commit.

### 6. Resultado del push
Indicar si la rama fue enviada correctamente al remoto.

### 7. Resultado del merge
Indicar si el merge a `develop` fue exitoso.

### 8. Verificación posterior
Confirmar estado de `develop`, estado del repo y cierre limpio del bloque.

### 9. Limpieza
Indicar si la rama local y remota fueron eliminadas.

### 10. Cambios restantes
Indicar qué cambios quedan pendientes por procesar.

## Regla final
Toda ejecución debe dejar trazabilidad completa del ciclo de vida del bloque atómico.