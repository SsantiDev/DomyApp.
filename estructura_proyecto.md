# Estructura del Proyecto

```text
.
├── Backend
│   ├── apps
│   │   ├── __init__.py
│   │   ├── payments
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── migrations
│   │   │   ├── models.py
│   │   │   ├── tests.py
│   │   │   └── views.py
│   │   ├── reviews
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── migrations
│   │   │   ├── models.py
│   │   │   ├── tests.py
│   │   │   └── views.py
│   │   ├── services
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── migrations
│   │   │   ├── models.py
│   │   │   ├── tests.py
│   │   │   └── views.py
│   │   └── users
│   │       ├── __init__.py
│   │       ├── admin.py
│   │       ├── apps.py
│   │       ├── migrations
│   │       ├── models.py
│   │       ├── serializers.py
│   │       ├── signals.py
│   │       ├── tests.py
│   │       └── views.py
│   ├── core
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── db.sqlite3
│   ├── manage.py
│   └── requirements.txt
├── Fronted
│   ├── App.test.js
│   ├── app
│   │   ├── (tabs)
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── two.tsx
│   │   ├── +html.tsx
│   │   ├── +not-found.tsx
│   │   ├── _layout.tsx
│   │   └── modal.tsx
│   ├── app.json
│   ├── assets
│   │   ├── fonts
│   │   │   └── SpaceMono-Regular.ttf
│   │   └── images
│   │       ├── adaptive-icon.png
│   │       ├── favicon.png
│   │       ├── icon.png
│   │       └── splash-icon.png
│   ├── components
│   │   ├── EditScreenInfo.tsx
│   │   ├── ExternalLink.tsx
│   │   ├── StyledText.tsx
│   │   ├── Themed.tsx
│   │   ├── __tests__
│   │   │   ├── StyledText-test.js
│   │   │   └── __snapshots__
│   │   ├── useClientOnlyValue.ts
│   │   ├── useClientOnlyValue.web.ts
│   │   ├── useColorScheme.ts
│   │   └── useColorScheme.web.ts
│   ├── constants
│   │   └── Colors.ts
│   ├── expo-env.d.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── config
│   │   │   └── env.ts
│   │   ├── services
│   │   │   ├── api.ts
│   │   │   ├── authStorage.ts
│   │   │   ├── queryClient.ts
│   │   │   └── testService.ts
│   │   └── types
│   │       └── auth.ts
│   └── tsconfig.json
├── LICENSE
├── estructura_proyecto.md
└── tree_out.txt
```
