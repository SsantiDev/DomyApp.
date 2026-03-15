# Safety rules — Git Protocol

## Objetivo
Definir las reglas de seguridad del flujo Git automatizado.

## Reglas obligatorias
- no usar `git add .` de forma indiscriminada
- no commitear secretos, credenciales, logs, dumps o archivos locales
- no mezclar cambios no relacionados en el mismo commit
- no hacer merge sin verificar el estado del bloque
- no borrar ramas sin confirmar integración exitosa
- no continuar con nuevos bloques si el bloque actual quedó inestable
- no automatizar por encima de señales de riesgo
- no empujar ramas con stage incoherente

## Archivos que deben revisarse con especial cuidado
- `.env`
- archivos de configuración local
- logs
- snapshots inesperados
- binarios generados
- lockfiles no relacionados
- artefactos temporales
- dumps de base de datos
- llaves privadas o certificados

## Regla de detención
Detener el flujo si:
- aparecen secretos o credenciales
- el bloque staged no es coherente
- el commit no puede describirse con una sola intención
- el merge genera conflicto no resuelto
- el estado del repositorio queda inconsistente
- `develop` no está estable o no puede actualizarse correctamente

## Regla final
Automatizar no significa relajar la disciplina del repositorio.