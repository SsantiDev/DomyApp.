---
description: Agrega cambios, analiza el diff y hace commit con Conventional Commits
---
// turbo-all
1. Ejecuta `git add .` para preparar los cambios.
2. Ejecuta `git diff --cached` para obtener los cambios preparados.
3. Analiza el diff obtenido y genera un mensaje de commit corto siguiendo el estándar de Conventional Commits (tipo: descripción).
4. Ejecuta `git commit -m "[mensaje generado]"` con el mensaje obtenido.
5. Ejecuta `git push` para subir los cambios al repositorio remoto.
