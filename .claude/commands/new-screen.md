---
name: new-screen
description: Crea una nueva pantalla completa en el frontend de DomyApp con su componente, estilos y ruta en Expo Router. Úsalo cuando necesites agregar una pantalla nueva end-to-end.
argument-hint: <nombre-pantalla> [descripción breve]
---

Voy a crear una nueva pantalla en DomyApp siguiendo las convenciones del proyecto.

**Pantalla solicitada:** $ARGUMENTS

## Pasos que seguiré

1. **Leer contexto** — reviso `constants/theme.ts`, `context/ThemeContext.tsx` y un componente existente similar para seguir el patrón exacto.

2. **Crear el componente** en `Fronted/components/` con:
   - Archivo principal `NombrePantalla.tsx`
   - Archivo de estilos `NombrePantalla.styles.ts` con `getStyles(colors)`
   - `useMemo(() => getStyles(colors), [colors])` para memoizar
   - Todas las variables de estilo desde `colors.*`, `SPACING.*`, `RADIUS.*`

3. **Crear la ruta** en `Fronted/app/` si es necesario (Expo Router file-based routing)

4. **Crear el hook** en `Fronted/hooks/` si la pantalla necesita lógica de datos

5. **Conectar con la API** usando los endpoints de `api_spec.md` si aplica

Al terminar, indico exactamente qué archivos creé y cómo navegar a la pantalla nueva.
