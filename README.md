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
- **Swagger/OpenAPI** - Documentación de la API

## 📦 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd challenge-bambu-tech-services
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=bambu_challenge

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h
```

4. **Configurar la base de datos**

Crea la base de datos en PostgreSQL:
```sql
CREATE DATABASE bambu_challenge;
```

Las tablas se crearán automáticamente al iniciar la aplicación gracias a TypeORM.

## 💻 Uso

### Modo Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000` (o el puerto configurado en `.env`)

### Modo Producción

```bash
npm run build
npm start
```

## 📚 Documentación de la API

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3000/docs
```

## 🏗️ Estructura del Proyecto

```
challenge-bambu-tech-services/
├── src/
│   ├── config/         # Configuraciones (DB, JWT, etc.)
│   ├── entities/       # Entidades de TypeORM
│   ├── routes/         # Rutas de la API
│   ├── controllers/    # Controladores
│   ├── services/       # Lógica de negocio
│   ├── middlewares/    # Middlewares (auth, validación)
│   ├── schemas/        # Esquemas de validación (Zod)
│   ├── utils/          # Utilidades
│   └── index.ts        # Punto de entrada
├── .env                # Variables de entorno (no incluido en git)
├── .gitignore
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

Tu Nombre

---

**Nota:** Este README se actualizará conforme avance el desarrollo del proyecto.
