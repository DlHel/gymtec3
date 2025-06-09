# Gymtec ERP

Sistema de gestión empresarial para Gymtec, desarrollado con Next.js 14, TypeScript, Prisma y PostgreSQL.

## Requisitos Previos

- Node.js 18.x o superior
- PostgreSQL 14.x o superior
- Git

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/gymtec-erp.git
cd gymtec-erp
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Editar el archivo `.env` con tus credenciales.

4. Configurar la base de datos:
```bash
npx prisma migrate dev
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
gymtec-erp/
├── src/
│   ├── app/                    # Rutas de la aplicación
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/               # Componentes base de UI
│   │   ├── forms/            # Componentes de formularios
│   │   └── modules/          # Componentes específicos por módulo
│   ├── lib/                  # Utilidades y configuraciones
│   ├── hooks/                # Custom hooks
│   ├── store/                # Estado global (Zustand)
│   ├── types/                # Definiciones de TypeScript
│   └── api/                  # API Routes
├── prisma/                   # Esquemas y migraciones
├── public/                   # Assets estáticos
└── tests/                    # Tests unitarios y de integración
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia la aplicación en modo producción
- `npm run lint`: Ejecuta el linter
- `npm run prisma:generate`: Genera el cliente de Prisma
- `npm run prisma:migrate`: Ejecuta las migraciones de la base de datos
- `npm run prisma:studio`: Abre Prisma Studio para gestionar la base de datos

## Características Principales

- Gestión de Clientes y Contratos
- Gestión de Inventario y Base de Conocimiento
- Sistema de Tickets y Servicios
- Portal del Cliente
- Gestión Financiera
- Control de Personal
- Analítica y Reportes
- Aplicación Móvil (PWA)

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma
- **Base de Datos**: PostgreSQL
- **Autenticación**: NextAuth.js
- **Estado Global**: Zustand
- **Formularios**: React Hook Form + Zod
- **UI Components**: Shadcn/ui

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 