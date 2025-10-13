# Project Structure

```
src/
├── app/                    # Application setup & entry point
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── features/               # Business logic features
│   └── navigation/         # Step navigation feature
│       ├── components/     # Navigation UI components
│       ├── utils/          # Navigation utilities
│       ├── types/          # TypeScript types
│       └── index.ts        # Barrel exports
├── shared/                 # Shared across features
│   └── utils/             # Common utilities
├── layouts/                # Architectural layouts
│   ├── MainLayout/        # Main app layout
│   └── LandingLayout/     # Landing page layout
├── pages/                  # Route components
│   ├── Home/              # Home page
│   ├── PageOne/           # Example pages
│   └── PageTwo/
└── test/                   # Test files
    ├── Header.simple.test.tsx
    ├── MainLayout.simple.test.tsx
    ├── utils.test.tsx
    └── setup.ts
```
