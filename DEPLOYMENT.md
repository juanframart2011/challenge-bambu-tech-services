# 🚀 Instrucciones de Despliegue - Challenge Bambu Tech Services

## ✅ Resumen del Proyecto

Este proyecto está **completamente listo para producción** con:

✅ TypeORM Migrations configuradas y probadas
✅ Docker y Docker Compose funcionando
✅ Swagger documentación completa
✅ Autenticación JWT
✅ Base de datos PostgreSQL
✅ CRUD completo de TODOs
✅ GitFlow implementado

## 🎯 Pasos para Ejecutar el Proyecto

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd challenge-bambu-tech-services
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` si es necesario (los valores por defecto funcionan bien).

3. **Iniciar con Docker Compose**
```bash
docker-compose up -d
```

4. **Verificar que esté funcionando**
```bash
curl http://localhost:3020/health
```

5. **Acceder a la documentación Swagger**
Abre en tu navegador: http://localhost:3020/docs

**¡Eso es todo!** Las migraciones se ejecutan automáticamente al iniciar.

### Opción 2: Sin Docker (Local)

1. **Requisitos previos**
   - Node.js v18+
   - PostgreSQL v14+

2. **Clonar e instalar**
```bash
git clone <repository-url>
cd challenge-bambu-tech-services
npm install
```

3. **Configurar base de datos**
```sql
CREATE DATABASE todo_db;
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el `.env` con tus credenciales de PostgreSQL.

5. **Iniciar el servidor**
```bash
npm run dev
```

**¡Listo!** El servidor estará en http://localhost:3000

## 🗄️ Migraciones

Las migraciones se ejecutan **automáticamente** al iniciar la aplicación.

### Verificar estado de migraciones
```bash
npm run migration:show
```

### Comandos de migraciones (opcionales)
```bash
# Ejecutar migraciones manualmente
npm run migration:run

# Revertir última migración
npm run migration:revert

# Generar nueva migración
npm run migration:generate -- src/migrations/NombreMigracion
```

## 📚 Endpoints Disponibles

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere token)

### TODOs
- `POST /api/todos` - Crear tarea
- `GET /api/todos` - Listar tareas (con paginación y filtros)
- `GET /api/todos/statistics` - Estadísticas de tareas
- `GET /api/todos/:id` - Obtener tarea
- `PUT /api/todos/:id` - Actualizar tarea
- `DELETE /api/todos/:id` - Eliminar tarea

### Sistema
- `GET /health` - Health check

## 🧪 Probar la API

### 1. Registrar un usuario
```bash
curl -X POST http://localhost:3020/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 2. Obtener el token
```bash
curl -X POST http://localhost:3020/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Crear una tarea (usa el token obtenido)
```bash
curl -X POST http://localhost:3020/api/todos \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primera tarea",
    "description": "Descripción de la tarea",
    "status": "pending",
    "priority": 5
  }'
```

### 4. Listar tareas
```bash
curl -X GET http://localhost:3020/api/todos \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 🐳 Comandos Docker Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f app

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Reconstruir imágenes
docker-compose up -d --build

# Ver estado de contenedores
docker-compose ps
```

## 📊 Base de Datos

### Estructura creada por migraciones:

**Tabla `users`:**
- id (uuid, primary key)
- email (unique)
- password (encrypted)
- name
- isActive
- createdAt, updatedAt

**Tabla `todos`:**
- id (uuid, primary key)
- title
- description
- status (enum: pending, in_progress, completed)
- dueDate
- priority (0-10)
- userId (foreign key → users)
- createdAt, updatedAt

**Índices creados:**
- IDX_todos_userId
- IDX_todos_status

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Validación de datos con Zod
- ✅ CORS configurado
- ✅ Variables de entorno para secretos

## 📖 Documentación

La documentación completa de la API está disponible en Swagger:
- **Con Docker**: http://localhost:3020/docs
- **Sin Docker**: http://localhost:3000/docs

## 🌲 GitFlow

El proyecto sigue la metodología GitFlow:
- `master` - Producción
- `develop` - Desarrollo
- `feature/*` - Nuevas funcionalidades

## ✨ Características Técnicas

- **Fastify** - Framework web de alto rendimiento
- **TypeORM** - ORM con migraciones
- **PostgreSQL** - Base de datos relacional
- **TypeScript** - Tipado estático
- **JWT** - Autenticación segura
- **Swagger** - Documentación automática
- **Docker** - Containerización
- **Zod** - Validación de schemas

## 📝 Notas Importantes

1. **Primera ejecución**: Las migraciones crean automáticamente todas las tablas
2. **Persistencia**: Los datos se mantienen entre reinicios (volúmenes Docker)
3. **Hot-reload**: Los cambios en código se reflejan automáticamente en desarrollo
4. **Producción**: Cambiar JWT_SECRET y NODE_ENV=production antes de deployar

## 🆘 Solución de Problemas

### El servidor no inicia
```bash
# Verificar logs
docker-compose logs app

# Reiniciar todo
docker-compose down -v
docker-compose up -d --build
```

### Error de conexión a base de datos
- Verifica que PostgreSQL esté corriendo: `docker-compose ps`
- Verifica las variables de entorno en `.env`

### Migraciones fallan
```bash
# Ver estado de migraciones
npm run migration:show

# Revertir y volver a ejecutar
npm run migration:revert
npm run migration:run
```

## 📧 Contacto

Para dudas sobre el proyecto, revisar el código o la documentación en Swagger.

---

**¡El proyecto está listo para ser evaluado y deployado!** 🚀
