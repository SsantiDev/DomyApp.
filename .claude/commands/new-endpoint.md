---
name: new-endpoint
description: Crea un nuevo endpoint en el backend Django de DomyApp. Genera modelo (si aplica), serializer, vista y URL. Úsalo cuando necesites exponer una nueva funcionalidad en la API.
argument-hint: <descripción del endpoint>
---

Voy a crear un nuevo endpoint en el backend de DomyApp.

**Endpoint solicitado:** $ARGUMENTS

## Pasos que seguiré

1. **Verificar que no existe** — reviso `api_spec.md` y `core/urls.py` para confirmar que no está duplicado.

2. **Identificar la app correcta** según el dominio:
   - `users` → perfiles, roles, disponibilidad
   - `services` → categorías, solicitudes, estados
   - `reviews` → calificaciones
   - `payments` → pagos
   - `support` → incidencias

3. **Crear el serializer** en `apps/<app>/serializers.py`

4. **Crear o actualizar la vista** en `apps/<app>/views.py`:
   - Verificación de rol si aplica (`CLIENT`/`WORKER`)
   - Permisos con `IsAuthenticated`
   - Respuestas estándar del proyecto

5. **Registrar la URL** en `core/urls.py`

6. **Migrar si hay cambios de modelo**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Actualizar `api_spec.md`** con el nuevo endpoint documentado.

Al terminar muestro un ejemplo de cómo llamar al endpoint desde el frontend.
