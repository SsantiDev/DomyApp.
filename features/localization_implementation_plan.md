# Plan de Implementación: Multi-idioma y Localización

Preparar la aplicación para escalar a otros mercados fuera de Colombia.

> **Prioridad**: Baja. App actualmente solo opera en Colombia en español. Implementar solo cuando haya plan concreto de expansión a otro mercado.

---

## Estado Actual

- Todos los textos hardcodeados en español
- No hay infraestructura i18n en frontend ni backend
- `profile.tsx` existe para agregar selector de idioma

---

## 1. Frontend — Internacionalización (i18n)

### Instalación
```bash
npm install i18next react-i18next
npx expo install expo-localization
```

### Inicialización (`Fronted/i18n/index.ts`) — archivo nuevo
```ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import es from '../locales/es.json';
import en from '../locales/en.json';

// Detectar idioma: AsyncStorage (manual) → locale del dispositivo → 'es'
const detectLanguage = async () => {
    const saved = await AsyncStorage.getItem('app_language');
    if (saved) return saved;
    const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'es';
    return ['es', 'en'].includes(deviceLocale) ? deviceLocale : 'es';
};

i18next.use(initReactI18next).init({
    resources: { es: { translation: es }, en: { translation: en } },
    lng: 'es',  // se sobreescribe en app startup
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
});

export default i18next;
```

Llamar `detectLanguage()` en `app/_layout.tsx` antes de renderizar.

### Archivos de traducción
```
Fronted/locales/es.json
Fronted/locales/en.json
```
Estructura anidada por pantalla:
```json
{
    "dashboard": {
        "greeting": "Bienvenida",
        "no_services": "No tienes servicios activos"
    },
    "service": {
        "status_pending": "Pendiente",
        "status_accepted": "Aceptado"
    }
}
```

### Pluralización
i18next maneja plurales con sufijo `_one` / `_other`:
```json
{
    "services_count_one": "{{count}} servicio",
    "services_count_other": "{{count}} servicios"
}
```
```ts
t('services_count', { count: n })  // → "1 servicio" o "3 servicios"
```

### Selector de idioma en perfil
```ts
// profile.tsx
const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem('app_language', lang);
    i18next.changeLanguage(lang);
};
const SUPPORTED_LANGUAGES = ['es', 'en'] as const;
const DEFAULT_LOCALE = 'es-CO';
```

### Localización de moneda y fechas
Usar `expo-localization` en lugar de `Intl` directamente (mejor soporte en React Native):
```ts
import * as Localization from 'expo-localization';
// Moneda
new Intl.NumberFormat(Localization.getLocales()[0].languageTag, {
    style: 'currency',
    currency: locale === 'en' ? 'USD' : 'COP'
}).format(amount)
// Fecha
new Intl.DateTimeFormat(Localization.getLocales()[0].languageTag).format(date)
```
**Nota**: `Intl` requiere que el engine JS del dispositivo lo soporte. En React Native con Hermes, está disponible desde RN 0.70+. Verificar versión de Expo SDK.

---

## 2. Backend — Internacionalización

### Configuración (`settings.py`)
```python
USE_I18N = True
LANGUAGE_CODE = 'es'
LANGUAGES = [('es', 'Español'), ('en', 'English')]
```

### Traducción de categorías (`django-modeltranslation`)
```bash
pip install django-modeltranslation
```
- Agregar a `INSTALLED_APPS` **antes** de las apps con modelos traducibles
- Crear `apps/services/translation.py`:
```python
from modeltranslation.translator import register, TranslationOptions
from .models import ServiceCategory

@register(ServiceCategory)
class ServiceCategoryTranslationOptions(TranslationOptions):
    fields = ('name', 'description')
```
- Ejecutar `manage.py makemigrations` y `manage.py migrate` — agrega campos `name_es`, `name_en` a la tabla
- La API devuelve el campo según header `Accept-Language` de la request automáticamente

### Respuesta de API según idioma
`django-modeltranslation` activa la traducción correcta vía middleware de Django cuando el cliente envía:
```
Accept-Language: en
```
El frontend debe enviar este header en todas las requests.

---

## 3. Consideraciones de Expansión

| Aspecto | Nota |
|---------|------|
| RTL (árabe/hebreo) | Requiere `I18nManager.forceRTL()` y estilos revisados — no compatible fácil con layouts actuales |
| Nuevas monedas | Agregar al selector de `SUPPORTED_LANGUAGES` y mapear moneda por locale |
| Nombres de operaria | No traducir — nombres propios permanecen igual |
| Contenido dinámico (admin) | Los textos escritos por admins (descripciones de servicio) necesitan traducción manual o via `django-modeltranslation` |

---

## 4. Plan de Acción

| Fase | Tarea | Bloqueante |
|------|-------|------------|
| 1 | Instalar `i18next` + crear `locales/es.json` con todos los textos actuales | Ninguno |
| 2 | Reemplazar strings hardcodeados por `t('...')` en componentes | Fase 1 |
| 3 | Selector de idioma en `profile.tsx` + `AsyncStorage` | Fase 2 |
| 4 | `locales/en.json` con traducciones al inglés | Fase 2 |
| 5 | `django-modeltranslation` para categorías + migración | Independiente |
| 6 | RTL support | Solo si hay mercado árabe/hebreo concreto |
