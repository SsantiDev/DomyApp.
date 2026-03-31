---
name: review-component
description: Revisa un componente React Native de DomyApp en detalle. Verifica estilos, uso del tema, performance y convenciones. Úsalo antes de dar por terminado un componente.
argument-hint: <ruta-del-componente>
---

Voy a revisar el componente de DomyApp en detalle.

**Componente:** $ARGUMENTS

## Qué voy a verificar

### Tema y estilos
- ¿Usa `useTheme()` y variables `colors.*`, `SPACING.*`, `RADIUS.*`?
- ¿Los estilos están en un archivo `.styles.ts` separado?
- ¿`getStyles(colors)` está memoizado con `useMemo`?
- ¿Hay colores, tamaños o espaciados hardcodeados que debería reemplazar?

### Estructura
- ¿La lógica de datos está en un hook separado?
- ¿El componente hace demasiadas cosas? (single responsibility)
- ¿Los props están bien tipados?

### Accesibilidad y UX
- ¿Los `TouchableOpacity` tienen `activeOpacity`?
- ¿Hay estados de carga y error manejados?
- ¿Las listas usan `keyExtractor`?

### Performance
- ¿Hay renders innecesarios? (objetos/arrays creados inline en el JSX)
- ¿Se necesita `useCallback` para funciones pasadas como props?

Al final entrego un reporte con los problemas encontrados por severidad y las correcciones concretas.
