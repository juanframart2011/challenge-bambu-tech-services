# Challenge Bambu Tech Services - Backend API

## 📋 Descripción del Proyecto

API REST desarrollada con TypeScript, Fastify y TypeORM para el desafío técnico de Bambu Tech Services. El proyecto implementa un sistema de autenticación y gestión de usuarios con PostgreSQL como base de datos.

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **TypeScript** - Lenguaje de programación
- **Fastify** - Framework web de alto rendimiento
- **TypeORM** - ORM para TypeScript y JavaScript
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Encriptación de contraseñas
- **Zod** - Validación de esquemas
- **Swagger** - Documentación de la API

## 📦 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Docker** (v20 o superior)
- **Docker Compose** (v2 o superior)

### Opción alternativa sin Docker:
- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

## 🚀 Instalación y Uso

### 🐳 Opción 1: Con Docker (Recomendado)

Esta es la forma más rápida y sencilla de ejecutar el proyecto. Docker Compose levantará automáticamente tanto la base de datos PostgreSQL como la aplicación Fastify.

1. **Clonar el repositorio**
```bash
git clone https://github.com/juanframart2011/challenge-bambu-tech-services
cd challenge-bambu-tech-services
```

2. **Configurar variables de entorno**

Copia el archivo de ejemplo y ajusta las variables según necesites:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_aqui
DB_NAME=todo_db

# JWT Configuration
JWT_SECRET=cambia_esto_por_un_secret_seguro
JWT_EXPIRES_IN=24h

# Docker Ports (Host Machine)
DOCKER_APP_PORT=3020
DOCKER_DB_PORT=5428
```

⚠️ **Importante**: El archivo `.env` no se sube al repositorio (está en `.gitignore`). Docker Compose leerá automáticamente estas variables.

3. **Levantar los servicios con Docker Compose**

Primera vez (construye las imágenes y levanta los contenedores):
```bash
docker-compose up --build
```

Ejecuciones posteriores:
```bash
docker-compose up
```

Para ejecutar en segundo plano (detached mode):
```bash
docker-compose up -d
```

3. **¡Listo!** Los servicios estarán disponibles en:
- **API Fastify**: `http://localhost:3020`
- **PostgreSQL**: `localhost:5428`
- **Swagger Docs**: `http://localhost:3020/docs`

#### Comandos útiles de Docker:

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs solo de la aplicación
docker-compose logs -f app

# Detener los servicios
docker-compose down

# Detener y eliminar volúmenes (borra la BD)
docker-compose down -v

# Reconstruir las imágenes
docker-compose build

# Reiniciar un servicio específico
docker-compose restart app
```

#### Características del entorno Docker:

✅ **Hot-reload activado**: Los cambios en el código se reflejan automáticamente sin reiniciar el contenedor  
✅ **PostgreSQL preconfigurado**: Base de datos lista para usar  
✅ **Volúmenes persistentes**: Los datos de la BD se mantienen entre reinicios  
✅ **Networking automático**: La app se conecta automáticamente a la BD  
✅ **Variables de entorno seguras**: Las credenciales se gestionan mediante archivo `.env`

### 💻 Opción 2: Instalación Local (Sin Docker)

1. **Clonar el repositorio**
```bash
git clone https://github.com/juanframart2011/challenge-bambu-tech-services
cd challenge-bambu-tech-services
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Copia el archivo de ejemplo y ajústalo:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=todo_db

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h
```

4. **Configurar la base de datos**

Crea la base de datos en PostgreSQL:
```sql
CREATE DATABASE todo_db;
```

5. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

### Modo Producción (Local)

```bash
npm run build
npm start
```

## �️ Migraciones de Base de Datos

El proyecto utiliza **TypeORM migrations** para gestionar el esquema de la base de datos de forma versionada y controlada.

### ✅ Ejecución Automática

Las migraciones se ejecutan **automáticamente** al iniciar la aplicación, tanto en Docker como en local. No necesitas ejecutar comandos manualmente.

### 📋 Comandos de Migraciones (Avanzado)

Si necesitas gestionar migraciones manualmente:

```bash
# Ver estado de las migraciones
npm run migration:show

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Generar nueva migración basada en cambios en entidades
npm run migration:generate -- src/migrations/NombreDeLaMigracion
```

### 📁 Migraciones Incluidas

El proyecto incluye la migración inicial que crea:
- ✅ Tabla `users` con campos: id, email, password, name, isActive, timestamps
- ✅ Tabla `todos` con campos: id, title, description, status, dueDate, priority, timestamps, userId
- ✅ Relación foreign key entre `todos` y `users` (CASCADE on delete)
- ✅ Índices para optimizar consultas por userId y status
- ✅ Tipo ENUM para status de TODOs (pending, in_progress, completed)

**Ubicación**: `src/migrations/1738598400000-InitialSchema.ts`

### 🔄 Primera Ejecución

Cuando ejecutes el proyecto por primera vez:
1. El servidor se conectará a la base de datos
2. Verificará las migraciones pendientes
3. Ejecutará automáticamente la migración inicial
4. Creará todas las tablas y estructuras necesarias

**Nota**: Si ya tienes las tablas creadas (por ejemplo, si corriste el proyecto antes con `synchronize: true`), las migraciones detectarán que la estructura ya existe y no duplicarán las tablas.

## �📚 Documentación de la API

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

- **Con Docker**: `http://localhost:3020/docs`
- **Sin Docker**: `http://localhost:3000/docs`

## 🏗️ Estructura del Proyecto

```
challenge-bambu-tech-services/
├── src/
│   ├── config/          # Configuración de variables de entorno
│   ├── db/              # Configuración de TypeORM y DataSource
│   ├── entities/        # Entidades de TypeORM (User, Todo)
│   ├── migrations/      # Migraciones de base de datos
│   ├── modules/         # Módulos de la aplicación
│   │   ├── auth/        # Módulo de autenticación
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.schemas.ts
│   │   │   └── index.ts
│   │   └── todo/        # Módulo de TODOs
│   │       ├── todo.controller.ts
│   │       ├── todo.service.ts
│   │       ├── todo.schemas.ts
│   │       └── index.ts
│   ├── plugins/         # Plugins de Fastify (JWT, Swagger)
│   ├── utils/           # Utilidades (bcrypt, etc.)
│   ├── app.ts           # Configuración de Fastify
│   └── main.ts          # Punto de entrada
├── .env                 # Variables de entorno (no incluido en git)
├── .env.example         # Ejemplo de variables de entorno
├── .gitignore
├── .dockerignore
├── Dockerfile           # Configuración de Docker para la app
├── docker-compose.yml   # Orquestación de servicios
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión (devuelve JWT token)
- `GET /api/auth/profile` - Obtener perfil del usuario autenticado (protegido)

### TODOs
- `POST /api/todos` - Crear nueva tarea (protegido)
- `GET /api/todos` - Listar tareas con paginación y filtros (protegido)
- `GET /api/todos/statistics` - Obtener estadísticas de tareas (protegido)
- `GET /api/todos/:id` - Obtener tarea por ID (protegido)
- `PUT /api/todos/:id` - Actualizar tarea (protegido)
- `DELETE /api/todos/:id` - Eliminar tarea (protegido)

### Otros
- `GET /health` - Health check del servidor

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con hot-reload
- `npm run build` - Compila el proyecto TypeScript
- `npm start` - Inicia el servidor en modo producción
- `npm test` - Ejecuta las pruebas

## 🔧 Configuración Adicional

### GitFlow

Este proyecto utiliza GitFlow como metodología de trabajo:

- `master` - Rama principal con código en producción
- `develop` - Rama de desarrollo donde se integran las features
- `feature/*` - Ramas para nuevas características (ej: `feature/swagger-postgresql-typeorm`)
- `hotfix/*` - Ramas para correcciones urgentes en producción
- `release/*` - Ramas para preparar nuevas versiones

**Flujo de trabajo:**
1. Crear feature branch desde develop: `git checkout -b feature/nombre-feature develop`
2. Desarrollar y hacer commits: `git commit -m "feat: descripción"`
3. Mergear a develop: `git checkout develop && git merge --no-ff feature/nombre-feature`
4. Para releases, crear rama release y mergear a master y develop

### TypeORM

El proyecto usa TypeORM con sincronización automática en desarrollo. Para producción, se recomienda usar migraciones.

### CORS

CORS está configurado para aceptar peticiones desde cualquier origen en desarrollo. Ajusta la configuración en producción según tus necesidades.

## 🤝 Contribución

Este es un proyecto de prueba técnica. 

## 📄 Licencia

ISC

## ✍️ Autor

Juan Rogelio Franco Martinez