---
name: domy-product-context-guard
description: aporta contexto estratégico, funcional y operativo de domy app para evaluar propuestas, features, flujos, mejoras y decisiones de producto dentro del propósito de formalizar, profesionalizar y hacer trazable el servicio doméstico en colombia. úsala cuando se necesite validar si una funcionalidad, cambio, flujo o decisión está alineada con el mvp, la confianza del usuario, la formalización del trabajo, la trazabilidad operativa, la seguridad, la experiencia móvil y la expansión progresiva del producto.
---

# Domy Product Context Guard

Esta skill define el contexto estratégico, funcional y operativo de Domy App para que cualquier decisión de producto, funcionalidad, flujo o mejora se evalúe dentro de la realidad del proyecto y no como si fuera una app genérica de servicios.

## Propósito
Usar esta skill para validar si una propuesta está alineada con:
- la misión de formalizar y profesionalizar el servicio doméstico en Colombia
- la necesidad de construir confianza entre hogares y operarias
- la trazabilidad de las interacciones y transacciones
- el enfoque actual del MVP
- la operación móvil real en contextos de conectividad variable
- la expansión progresiva mediante densidad local

## Flujo de trabajo
1. Revisar `references/mission-and-vision.md`.
2. Revisar `references/product-scope.md`.
3. Revisar `references/user-model.md`.
4. Si la propuesta afecta confianza, validación o percepción de seguridad, revisar `references/trust-and-safety.md`.
5. Si la propuesta afecta el MVP actual, revisar `references/mvp-capabilities.md`.
6. Evaluar la propuesta con `references/feature-evaluation-rules.md`.
7. Si la decisión tiene impacto comercial u operativo, revisar `references/business-constraints.md` y `references/growth-strategy.md`.
8. Si se requiere contexto país, revisar `references/colombia-market-context.md`.
9. Responder usando `references/output-template.md`.
10. Si se desea una validación rápida de alineación, ejecutar `python3 scripts/verify_product_alignment.py`.

## Reglas obligatorias
- No tratar a Domy como una app genérica de marketplace.
- Priorizar siempre confianza, formalización y trazabilidad.
- No proponer features que aumenten complejidad sin reforzar el valor central del producto.
- No expandir el alcance del MVP sin justificar impacto en misión, confianza u operación.
- Evaluar siempre el efecto de una decisión sobre hogares, operarias y operación real.
- Considerar siempre el contexto colombiano y la conectividad variable.
- Distinguir entre digitalizar un proceso y profesionalizarlo realmente.
- Señalar cuando una propuesta aporta valor aparente pero no valor estratégico real.

## Principios del producto
- confianza antes que escala desordenada
- claridad antes que sobrecarga funcional
- formalización antes que improvisación operativa
- trazabilidad antes que opacidad
- crecimiento progresivo antes que expansión prematura
- experiencia móvil simple antes que complejidad innecesaria

## Qué debe incluir toda respuesta
Toda evaluación debe incluir, cuando aplique:
- resumen de la propuesta
- alineación con la misión de Domy
- impacto en hogares
- impacto en operarias
- impacto en confianza y seguridad
- encaje dentro del MVP o fuera de él
- impacto operativo y de negocio
- riesgos principales
- recomendación final

## Criterios de decisión rápida
- si mejora confianza, validación, reputación o seguridad percibida: alta relevancia
- si mejora coordinación del servicio: alta relevancia
- si mejora transparencia económica: alta relevancia
- si mejora trazabilidad operativa: alta relevancia
- si agrega complejidad sin fortalecer el núcleo del producto: baja prioridad o desalineación
- si responde a una necesidad periférica antes de consolidar el MVP: postergar
- si exige una operación difícil de sostener en etapa temprana: revisar con cautela
- si debilita claridad, confianza o foco: no aprobar

## Qué sí debe hacer esta skill
- evaluar si una feature encaja con Domy
- validar si una decisión está alineada con la misión
- detectar propuestas desalineadas con el MVP
- explicar el impacto de una funcionalidad en confianza, trazabilidad y operación
- priorizar entre propuestas usando contexto real del producto
- distinguir entre mejoras núcleo y mejoras periféricas
- advertir riesgos de negocio, operación o percepción de confianza

## Qué no debe hacer esta skill
- diseñar arquitectura técnica detallada por sí sola
- reemplazar decisiones de frontend o backend específicas
- asumir que toda buena idea debe entrar al MVP
- aprobar propuestas solo porque “suenan innovadoras”
- priorizar moda, complejidad o amplitud por encima del foco estratégico

## Regla final
Toda decisión de producto debe reforzar al menos una de estas dimensiones sin deteriorar significativamente las demás:
- confianza
- formalización
- trazabilidad
- claridad operativa
- viabilidad del MVP
- experiencia móvil realista