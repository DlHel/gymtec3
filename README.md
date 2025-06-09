# Gymtec ERP

Sistema de gestión empresarial para Gymtec, desarrollado con Next.js 14, TypeScript, Prisma y SQLite.

## ✅ Estado del Proyecto

**¡CONFIGURACIÓN COMPLETADA!** El proyecto está listo para usar.

## Requisitos Previos

- Node.js 18.x o superior ✅ (v22.16.0 instalado)
- Git ✅ (v2.48.1 instalado)

## Instalación y Configuración

✅ **Ya completado automáticamente:**

1. **Repositorio clonado** desde GitHub
2. **Dependencias instaladas** con `npm install`
3. **Base de datos configurada** (SQLite para desarrollo)
4. **Variables de entorno creadas** (`.env`)
5. **Migraciones ejecutadas** con Prisma
6. **Datos de ejemplo cargados** con seed
7. **Servidor iniciado** en http://localhost:3000

## Acceso Rápido

🌐 **Aplicación:** http://localhost:3000
📊 **Dashboard:** http://localhost:3000/dashboard

## Usuarios de Prueba

- **Administrador:** admin@gymtec.com / admin123
- **Técnico:** tecnico@gymtec.com / tech123

## Comandos Disponibles

```bash
npm run dev          # Servidor de desarrollo (YA EJECUTÁNDOSE)
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run prisma:seed  # Cargar datos de ejemplo (YA EJECUTADO)
npm run prisma:studio # Abrir Prisma Studio
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