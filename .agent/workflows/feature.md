---
description: Detecta el tipo de cambio automáticamente y gestiona el flujo de ramas con optimización de tests
---
// turbo-all
1. Ejecuta `git add .` y analiza el diff de los cambios.
2. La IA clasifica el cambio como `feat`, `fix`, `docs`, `refactor`, `chore`, `style` o `test`.
3. Pide al usuario un nombre para la funcionalidad.
4. Crea la rama con el prefijo detectado.
5. Genera un mensaje de commit que empieza con dicho prefijo.
6. Ejecuta los tests de Django y React **solo si** el cambio es `feat`, `fix`, `refactor` o `test`.
7. Si los tests fallan, muestra un mensaje de error y cancela el merge.
8. Si los tests pasan (o se saltan), sube la rama, cambia a `develop`, hace merge y sube los cambios.
9. Muestra un mensaje de éxito al finalizar correctamente.
