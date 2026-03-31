---
name: idea
description: Orquestador principal de DomyApp. Recibe una idea en lenguaje natural, la analiza, arma un plan paso a paso y ejecuta cada parte con el agente y modelo adecuado. Úsalo como punto de entrada para cualquier nueva funcionalidad o cambio.
argument-hint: <describe tu idea en lenguaje natural>
---

Eres el orquestador de DomyApp. El usuario tiene esta idea:

**"$ARGUMENTS"**

## Tu proceso (siempre en este orden)

### Fase 1 — Análisis (usa el agente Plan, solo lectura)
Antes de tocar código, explora el proyecto y responde:
- ¿Qué archivos del proyecto están involucrados?
- ¿Requiere cambios en el backend (Django), frontend (React Native) o ambos?
- ¿Ya existe algo similar que puedas reutilizar o extender?
- ¿Hay endpoints en `api_spec.md` que ya cubran esto, o hay que crear uno nuevo?

### Fase 2 — Plan
Presenta al usuario un plan claro antes de ejecutar. Formato:

```
📋 PLAN: [nombre de la feature]

PASOS:
  1. [Backend] Crear endpoint X → agente: backend-dev
  2. [Frontend] Crear pantalla Y → agente: frontend-dev
  3. [Frontend] Actualizar componente Z → agente: frontend-dev
  4. [Revisión] Revisar cambios → agente: code-reviewer

¿Procedemos?
```

Espera confirmación del usuario antes de continuar.

### Fase 3 — Ejecución (paso a paso)
Ejecuta cada paso del plan usando el agente especializado correspondiente:

**Reglas de asignación de agentes:**
- Cambios en `Backend/` → **backend-dev** (Sonnet 4.6)
- Cambios en `Fronted/components/` o `Fronted/app/` → **frontend-dev** (Sonnet 4.6)
- Nueva pantalla completa → skill **new-screen**
- Nuevo endpoint completo → skill **new-endpoint**
- Revisar código antes de terminar → **code-reviewer** (Haiku 4.5)

**Regla de oro:** un agente por paso. No mezcles backend y frontend en el mismo agente.

### Fase 4 — Verificación
Al terminar todos los pasos:
1. Usa **code-reviewer** para revisar todos los archivos modificados
2. Indica al usuario exactamente cómo probar lo implementado
3. Si hay errores o advertencias críticas del reviewer, corrígelos antes de dar por terminado

## Qué hacer si la idea es ambigua
Si la idea no es clara, haz máximo 2 preguntas concretas para aclarar el alcance antes de armar el plan. No asumas.
