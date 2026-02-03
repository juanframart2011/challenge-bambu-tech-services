# Ejemplos de Uso de la API

Este documento contiene ejemplos de cómo usar la API de TODOs.

## 📝 Registro de Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "name": "Juan Pérez"
  }'
```

**Respuesta:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔐 Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "usuario@example.com",
    "name": "Juan Pérez"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 👤 Obtener Perfil

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ✅ Crear TODO

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Completar proyecto",
    "description": "Implementar API REST con Fastify, TypeORM y PostgreSQL",
    "status": "in_progress",
    "priority": 8,
    "dueDate": "2024-12-31T23:59:59Z"
  }'
```

**Respuesta:**
```json
{
  "id": "uuid-here",
  "title": "Completar proyecto",
  "description": "Implementar API REST con Fastify, TypeORM y PostgreSQL",
  "status": "in_progress",
  "priority": 8,
  "dueDate": "2024-12-31T23:59:59.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "user-uuid-here"
}
```

## 📋 Listar TODOs

### Sin filtros
```bash
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Con filtros y paginación
```bash
curl -X GET "http://localhost:3000/api/todos?status=pending&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Respuesta:**
```json
{
  "todos": [
    {
      "id": "uuid-1",
      "title": "Tarea 1",
      "description": "Descripción 1",
      "status": "pending",
      "priority": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 15,
  "page": 1,
  "totalPages": 2
}
```

## 📊 Obtener Estadísticas

```bash
curl -X GET http://localhost:3000/api/todos/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Respuesta:**
```json
{
  "total": 20,
  "pending": 8,
  "inProgress": 5,
  "completed": 7
}
```

## 🔍 Obtener TODO por ID

```bash
curl -X GET http://localhost:3000/api/todos/uuid-here \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ✏️ Actualizar TODO

```bash
curl -X PUT http://localhost:3000/api/todos/uuid-here \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "priority": 10
  }'
```

## 🗑️ Eliminar TODO

```bash
curl -X DELETE http://localhost:3000/api/todos/uuid-here \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Respuesta:**
```json
{
  "message": "Tarea eliminada exitosamente"
}
```

## 💚 Health Check

```bash
curl -X GET http://localhost:3000/health
```

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## 📚 Documentación Swagger

Para una experiencia interactiva completa, visita:
- **Local**: http://localhost:3000/docs
- **Docker**: http://localhost:3020/docs

En Swagger puedes:
- ✅ Ver todos los endpoints disponibles
- ✅ Probar las peticiones directamente desde el navegador
- ✅ Ver esquemas de request/response
- ✅ Autenticar con tu token JWT

## 🔑 Autenticación en Swagger

1. Obtén tu token mediante `/api/auth/login` o `/api/auth/register`
2. Haz clic en el botón "Authorize" en Swagger
3. Ingresa tu token en el formato: `Bearer YOUR_TOKEN_HERE`
4. Haz clic en "Authorize" y cierra el modal
5. ¡Ahora puedes hacer peticiones autenticadas!

## Estados de TODO

Los TODOs pueden tener uno de los siguientes estados:
- `pending` - Pendiente
- `in_progress` - En progreso
- `completed` - Completado

## Códigos de Error Comunes

- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (token inválido o faltante)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error (error del servidor)
