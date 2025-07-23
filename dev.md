src/
├── app/
│   ├── core/                     # Global singleton services, guards, models
│   │   ├── services/             # API, Auth, Logger, etc.
│   │   ├── guards/               # Route guards
│   │   ├── interceptors/         # HTTP interceptors
│   │   ├── models/               # Global interfaces/types/enums
│   │   └── core.config.ts        # Core injector/initializer
│
│   ├── shared/                   # Reusable UI + logic components
│   │   ├── components/           # Reusable buttons, modals, cards, etc.
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── shared.config.ts      # Standalone config to import/export
│
│   ├── features/                 # Route-driven, standalone feature components
│   │   ├── home/
│   │   │   ├── home.component.ts
│   │   │   ├── home.page.ts      # Standalone route component
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── home.routes.ts    # Child routes if needed
│   │   ├── products/
│   │   │   └── ...
│   │   └── ...
│
│   ├── layout/                   # App shell: nav, header, sidebar
│   │   ├── main-layout.component.ts
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── layout.config.ts
│
│   ├── config/                   # App-level config and constants
│   │   ├── environment.tokens.ts
│   │   └── api-endpoints.ts
│
│   ├── app.routes.ts             # Main application routes
│   └── app.component.ts          # Bootstrap standalone root component
│
├── assets/                       # Static assets (images, fonts, etc.)
├── environments/                # Environment files
│   ├── environment.ts
│   └── environment.prod.ts
└── main.ts                       # Bootstraps the app
