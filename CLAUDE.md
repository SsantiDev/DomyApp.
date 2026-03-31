# DomyApp

Aplicación móvil de servicios del hogar (limpieza, plomería, etc.) que conecta clientes con operarias.
Stack: **Django 6 + DRF** (backend) · **React Native + Expo Router** (frontend) · **JWT** (auth) · **SQLite dev / Postgres prod**

---

## Estructura del proyecto

```
DomyApp/
├── Backend/          # Django REST API
│   ├── apps/
│   │   ├── users/    # Modelo User con roles CLIENT | WORKER
│   │   ├── services/ # Categorías y ServiceRequest (PENDING→ACCEPTED→IN_PROGRESS→COMPLETED)
│   │   ├── reviews/  # Calificaciones 1-5
│   │   ├── payments/ # Módulo de pagos
│   │   └── support/  # Incidencias (LATE|NO_SHOW|DAMAGE|SAFETY|OTHER)
│   └── core/         # settings.py, urls.py
├── Fronted/          # React Native / Expo
│   ├── app/          # Rutas (Expo Router)
│   ├── components/
│   │   ├── dashboard/  # ClientDashboard, WorkerDashboard
│   │   ├── auth/
│   │   ├── ui/         # NativeButton, NativeCard, NativeInput
│   │   └── layout/
│   ├── constants/
│   │   └── theme.ts    # LIGHT_COLORS, DARK_COLORS, SPACING, RADIUS, TYPOGRAPHY
│   ├── context/
│   │   └── ThemeContext.tsx  # useTheme() → { colors, theme }
│   └── hooks/
```

---

## Comandos

**Backend**
```bash
cd Backend
python manage.py runserver        # Dev server (puerto 8000)
python manage.py makemigrations   # Nueva migración
python manage.py migrate          # Aplicar migraciones
python manage.py test             # Tests
```

**Frontend**
```bash
cd Fronted
npx expo start        # Dev server
npx expo start --web  # Web
npm test              # Tests
```

---

## Convenciones de código

### Frontend (React Native)
- **Siempre** usar variables del tema: `useTheme()` → `colors`, `SPACING`, `RADIUS`, `TYPOGRAPHY` de `constants/theme.ts`
- Estilos en archivo separado `*.styles.ts` usando `StyleSheet.create` con función `getStyles(colors)`
- Componentes funcionales con hooks, sin clases
- Imports de íconos desde `lucide-react-native`
- `useMemo(() => getStyles(colors), [colors])` para memoizar estilos

### Backend (Django)
- Una app por dominio: `users`, `services`, `reviews`, `payments`, `support`
- Serializers en `serializers.py`, lógica de negocio en `views.py`
- Permisos con `IsAuthenticated` + comprobaciones de `role` en la vista
- Respuestas REST estándar: 200/201 éxito, 400 validación, 401/403 auth, 404 no encontrado
- Migraciones siempre tras cambios de modelo

### API
Ver `api_spec.md` para todos los endpoints. Base URL: `http://localhost:8000`
Auth: header `Authorization: Bearer <access_token>`

---

## Roles de usuario
- `CLIENT` — solicita servicios, califica, reporta incidencias
- `WORKER` — acepta labores, marca inicio/fin, cambia disponibilidad

## Estados de ServiceRequest
`PENDING` → `ACCEPTED` → `IN_PROGRESS` → `COMPLETED` (o `CANCELLED`)

## Sistema de tema
```ts
// Paleta principal
primary:    '#667eea' (light) / '#7c8ef2' (dark)
primaryDark:'#5a67d8' (light) / '#667eea' (dark)
success:    '#48bb78' / '#68d391'
warning:    '#ed8936' / '#f6ad55'
danger:     '#f56565' / '#fc8181'
background: '#ffffff' / '#0f0f23'
surface:    '#f8fafc' / '#1a1a2e'
categoryBg: '#f0f4ff' / '#1e1e3f'
```
