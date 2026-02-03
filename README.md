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

## 📚 Documentación de la API

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

- **Con Docker**: `http://localhost:3020/docs`
- **Sin Docker**: `http://localhost:3000/docs`

## 🏗️ Estructura del Proyecto

```
challenge-bambu-tech-services/
├── src/
│   ├── config/         # Configuraciones (DB, JWT, etc.)
│   ├── db/             # Configuración de TypeORM y DataSource
│   ├── entities/       # Entidades de TypeORM
│   ├── routes/         # Rutas de la API
│   ├── controllers/    # Controladores
│   ├── services/       # Lógica de negocio
│   ├── middlewares/    # Middlewares (auth, validación)
│   ├── schemas/        # Esquemas de validación (Zod)
│   ├── utils/          # Utilidades
│   ├── app.ts          # Configuración de Fastify
│   └── main.ts         # Punto de entrada
├── .env                # Variables de entorno (no incluido en git)
├── .gitignore
├── .dockerignore
├── Dockerfile          # Configuración de Docker para la app
├── docker-compose.yml  # Orquestación de servicios
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Endpoints Principales

*(Se actualizará con los endpoints específicos una vez implementados)*

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión

### Usuarios
- `GET /api/users` - Listar usuarios (protegido)
- `GET /api/users/:id` - Obtener usuario por ID (protegido)
- `PUT /api/users/:id` - Actualizar usuario (protegido)
- `DELETE /api/users/:id` - Eliminar usuario (protegido)

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