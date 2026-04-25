# Roadmap de Puntos Faltantes — DomyApp

Tras una auditoría profunda del código actual, se han identificado los siguientes módulos y funcionalidades que aún están pendientes de implementación para alcanzar una versión de producción completa.

## 1. Integración de Pasarela de Pagos
- **Estado Actual**: El módulo `Backend/apps/payments` existe pero está prácticamente vacío. El frontend menciona "Pago seguro" pero es solo un marcador de posición.
- **Pendiente**:
    - Integrar una pasarela real (Stripe, Mercado Pago, Payer, etc.).
    - Implementar flujo de captura de tarjeta/método de pago en el frontend.
    - Lógica de backend para procesar transacciones y gestionar el estado `is_billed` de los servicios.

## 2. Sistema de Comunicación en Tiempo Real 🟢 (Implementado)
- **Estado Actual**: Migrado satisfactoriamente de **polling** a **WebSockets** y **Notificaciones Push**.

## 3. Seguimiento Geográfico en Vivo
- **Estado Actual**: Los mapas en el detalle del servicio son estáticos y basados en la dirección proporcionada.
- **Pendiente**:
    - Integrar tracking en tiempo real de la operaria cuando el servicio está "En camino".
    - Actualizar la posición en el mapa del cliente dinámicamente.

## 4. Evolución del Panel Administrativo
- **Estado Actual**: Existe un dashboard básico para gestionar verificaciones y ver servicios.
- **Pendiente**:
    - **Reportes Financieros**: Visualización de ingresos totales, comisiones de la plataforma y pagos pendientes a operarias.
    - **Gestión de Disputas**: Interfaz para que el administrador resuelva incidencias reportadas (soporte).
    - **Métricas de Crecimiento**: Gráficas de servicios solicitados vs completados por zona/categoría.

## 5. Experiencia de Usuario y Pulido (UX)
- **Estado Actual**: Funcionalidad base operativa.
- **Pendiente**:
    - **Gestión de Direcciones**: Permitir al cliente guardar múltiples domicilios (Casa, Oficina, etc.).
    - **Favoritos**: Opción para marcar operarias preferidas y solicitarlas directamente.
    - **Historial Detallado**: Filtros avanzados en las listas de servicios pasados.

## 6. Soporte Multi-idioma y Localización
- **Estado Actual**: Hardcoded en español.
- **Pendiente**: Implementar i18next o similar para soportar otros idiomas y formatos de moneda dinámicos.
