---
name: "git_protocol"
description: "Protocolo Maestro de Commits Atómicos para el ecosistema Domy. Garantiza trazabilidad, calidad de código y despliegue continuo mediante Conventional Commits y segmentación por intención."
tipo: skill_ia
estado: activo
owner: "[[santiago]]"
impacto: Calidad y Despliegue
fecha_actualizacion: 2026-03-08
tags: [git, ci-cd, conventional-commits, atomic-design, workflow, devops]
---
# Protocolo Maestro — Commits Atómicos & Excelencia en Git

## Visión General
Este protocolo define el estándar de oro para la persistencia de cambios en el proyecto. No solo se trata de guardar código, sino de documentar la evolución del sistema con precisión quirúrgica.

## Criterios de Aplicación
- **Activación:** Siempre que se requiera persistir cambios o el usuario solicite un commit.
- **Atomicidad:** Obligatorio para cambios que afecten múltiples responsabilidades.
- **Integración:** Actúa como el motor de preparación para el workflow `feature.yaml`.

## Comportamiento del Agente (Core Flow)
1. **Auditoría de Estado:**
   - Analizar detalladamente `git status --short` y `git diff`.
2. **Segmentación por Intención:**
   - Identificar unidades lógicas de cambio. Un "Bloque Atómico" es el conjunto mínimo de cambios que puede ser testeado y desplegado de forma independiente sin romper la estabilidad.
3. **Staging Selectivo (El Arte del Stage):**
   - **PROHIBIDO:** `git add .` indiscriminado.
   - **TÉCNICA:** Usar `git add <archivo>` para archivos completos o `git add -p` para segmentar cambios dentro de un mismo archivo.
3. **Validación Pre-Vuelo:**
   - Ejecutar el script de verificación: `python .agent/skills/GIT-PROTOCOL/scripts/verify.py`.
   - Verificar con `git diff --cached` que el bloque actual es coherente y no contiene secretos o ruido (archivos `.env`, logs, etc.).
5. **Delegación al Workflow:**
   - Una vez el staging está listo, invocar el comando `/feature` o ejecutar `feature.yaml`.

## Reglas de Excelencia Atómica
- **Single Responsibility Principle applied to Commits:** Un commit = Un propósito.
- **Incompatibilidades:** Nunca mezclar `refactor` con `feat`, ni `fix` con `style`.
- **Inclusión de Tests:** Los tests deben formar parte del mismo commit que la funcionalidad que prueban.
- **Limpieza:** Excluir archivos de configuración local, binarios autogenerados o `lockfiles` no relacionados.

## Estándar de Mensajes (Conventional Commits)
Se debe seguir estrictamente el estándar de Angular/Conventional:
- `feat:` Nuevas funcionalidades.
- `fix:` Corrección de errores.
- `docs:` Cambios en documentación.
- `style:` Formato, puntos y comas faltantes, etc. (no afecta la lógica).
- `refactor:` Cambio de código que no corrige un error ni añade funcionalidad.
- `test:` Adición o corrección de tests.
- `chore:` Tareas de mantenimiento, dependencias, configuración de herramientas.

## Integración con feature.yaml
El workflow `feature.yaml` es el responsable de la lógica de ramas y tests. El Agente debe:
1. Preparar el **Stage**.
2. Dejar que `feature.yaml` gestione el nombre de la rama, el mensaje de commit (basado en el stage) y el flujo de merge.
3. El Agente debe permanecer atento al resultado del workflow para reaccionar ante errores de tests.

## Lógica de Decisión ante Conflictos o Errores
- **Script de Verificación:** Si `verify.py` arroja errores [CRITICAL] o [WARNING], el agente debe detenerse y resolverlos antes de invocar `/feature`.
- **Fallo de Tests:** Si el workflow falla, la integración a `develop` se detiene. El agente debe analizar el log de tests y proponer correcciones sobre la rama creada, NO volver a `develop` hasta que el bloque sea sólido.
- **Secretos Detectados:** Si el agente visualiza posibles credenciales en el diff, debe abortar inmediatamente el proceso de staging e informar al usuario.

## Contrato de Salida
Tras cada ciclo de commit, el agente informará:
- **Resumen del Bloque Intervenido:** (ej: Refactorización de Auth Service).
- **Archivos Staged:** Lista técnica.
- **Estado del Repositorio:** Cambios restantes por procesar.

---
*Este protocolo es vinculante y garantiza que cada línea de código en 'develop' haya pasado por un proceso de revisión y validación atómica.*