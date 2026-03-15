# Output template — Domy Refactor Guard

## Objetivo
Toda intervención de refactor debe seguir esta estructura de salida.

## Plantilla obligatoria

### 1. Unidad auditada
Indicar qué se auditó:
- archivo
- módulo
- componente
- función
- hook
- service
- view
- serializer
- manager
- flujo de queries
- otra unidad relevante

### 2. Tipo de deuda detectada
Clasificar la deuda encontrada:
- duplicación
- baja cohesión
- demasiadas responsabilidades
- naming deficiente
- capa incorrecta
- complejidad innecesaria
- tipado deficiente
- estructura pobre
- acoplamiento excesivo

### 3. Diagnóstico
Explicar por qué esa deuda afecta claridad, mantenibilidad, testabilidad o alineación arquitectónica.

### 4. Refactors propuestos
Listar los cambios razonables y priorizados.

### 5. Refactors ejecutados
Indicar cuáles se aplicaron realmente y por qué eran seguros.

### 6. Preservación de comportamiento
Explicar por qué los cambios no alteran funcionalidad observable.

### 7. Alineación arquitectónica
Indicar cómo mejora el encaje de la unidad con frontend, backend o arquitectura del proyecto.

### 8. Riesgos no ejecutados
Explicar qué posibles mejoras se dejaron fuera por riesgo funcional o contractual.

### 9. Recomendación final
Indicar el siguiente mejor paso de refactor si aplica.

## Reglas de calidad
La respuesta debe:
- distinguir claramente entre propuesta y ejecución
- justificar por qué el cambio es seguro
- no ocultar riesgos
- no presentar como seguro algo que no lo es
- evitar refactor por gusto personal
- cerrar con una recomendación clara y práctica