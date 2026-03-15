# Especificación Técnica de APIs - DomyApp

Este documento proporciona una guía detallada de todos los endpoints disponibles en el backend de DomyApp, organizados por módulos.

---

## 1. Autenticación (JWT)

| Endpoint | Método | Descripción | Respuesta Exitosa |
| :--- | :--- | :--- | :--- |
| `/api/auth/token/` | `POST` | Obtener tokens de acceso y refresco (Login) | 200 OK |
| `/api/auth/token/refresh/` | `POST` | Refrescar el token de acceso | 200 OK |

**Cuerpo de petición (Login):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "mi_password_seguro"
}
```

---

## 2. Usuarios y Perfiles

| Endpoint | Método | Descripción | Respuesta Exitosa |
| :--- | :--- | :--- | :--- |
| `/api/users/register/` | `POST` | Registro de nuevos usuarios (CLIENT o WORKER) | 201 Created |
| `/api/users/me/` | `GET` | Obtener perfil del usuario autenticado | 200 OK |
| `/api/users/profile/` | `PATCH` | Actualizar perfil de Cliente | 200 OK |
| `/api/users/profile/worker/` | `PATCH` | Actualizar perfil de Operaria | 200 OK |
| `/api/users/profile/toggle-availability/` | `POST` | Cambiar estado de disponibilidad (Solo Operarias) | 200 OK |

### Estructura de Registro:
```json
{
  "username": "nombre_usuario",
  "email": "email@ejemplo.com",
  "password": "password",
  "role": "CLIENT" | "WORKER",
  "first_name": "Nombre",
  "last_name": "Apellido"
}
```

---

## 3. Servicios y Labores

| Endpoint | Método | Descripción | Respuesta Exitosa |
| :--- | :--- | :--- | :--- |
| `/api/services/categories/` | `GET` | Listar categorías de servicios activas | 200 OK |
| `/api/services/requests/` | `GET` | Listar solicitudes (Filtrado según rol) | 200 OK |
| `/api/services/requests/` | `POST` | Crear una nueva solicitud de servicio | 201 Created |
| `/api/services/requests/{id}/` | `GET` | Ver detalle de una labor específica | 200 OK |
| `/api/services/requests/{id}/accept/` | `POST` | Operaria acepta una labor pendiente | 200 OK |
| `/api/services/requests/{id}/start/` | `POST` | Operaria marca inicio de la labor | 200 OK |
| `/api/services/requests/{id}/complete/` | `POST` | Operaria marca finalización de la labor | 200 OK |
| `/api/services/requests/{id}/rate/` | `POST` | Cliente califica la labor completada | 201 Created |

### Cuerpo de Calificación:
```json
{
  "rating": 1-5,
  "comment": "Texto opcional"
}
```

---

## 4. Soporte e Incidencias

| Endpoint | Método | Descripción | Respuesta Exitosa |
| :--- | :--- | :--- | :--- |
| `/api/support/incidents/` | `GET` | Listar incidencias relacionadas al usuario | 200 OK |
| `/api/support/incidents/` | `POST` | Reportar una nueva incidencia | 201 Created |

### Cuerpo de Incidencia:
```json
{
  "service_request": 1,
  "incident_type": "LATE" | "NO_SHOW" | "DAMAGE" | "SAFETY" | "OTHER",
  "description": "Detalles de lo sucedido"
}
```

---

## 5. Códigos de Estado Comunes

- **200 OK**: Petición exitosa.
- **201 Created**: Recurso creado exitosamente (Registro, Solicitudes, Calificaciones).
- **400 Bad Request**: Error de validación o lógica de negocio (ej. intentar iniciar una labor ya finalizada).
- **401 Unauthorized**: Token inválido o expirado.
- **403 Forbidden**: El usuario no tiene permisos para esa acción (ej. Cliente intentando aceptar labor).
- **404 Not Found**: El recurso solicitado no existe.
- **500 Internal Server Error**: Error inesperado en el servidor.
