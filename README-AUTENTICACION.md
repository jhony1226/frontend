# Implementación de Autenticación en appCobros

## ✅ Frontend Implementado

### 1. Servicio de Autenticación
- **Archivo**: `frontend/src/app/services/auth.service.ts`
- **Funcionalidades**:
  - Login con email y contraseña
  - Registro de nuevos usuarios
  - Logout
  - Verificación de autenticación
  - Gestión de tokens en localStorage
  - Observable para estado de usuario actual
  - Métodos para verificar roles (admin/cobrador)

### 2. Auth Guard
- **Archivo**: `frontend/src/app/guards/auth.guard.ts`
- **Funcionalidades**:
  - Protección de rutas autenticadas
  - Guard para rutas de administrador
  - Redirección a login si no está autenticado

### 3. Interceptor HTTP
- **Archivo**: `frontend/src/app/interceptors/auth.interceptor.ts`
- **Funcionalidades**:
  - Agrega automáticamente el token Bearer a todas las peticiones HTTP
  - Maneja errores 401 (no autorizado) con logout automático

### 4. Componente Login
- **Archivos**: 
  - `frontend/src/app/views/pages/login/login.component.ts`
  - `frontend/src/app/views/pages/login/login.component.html`
- **Funcionalidades**:
  - Formulario reactivo con validaciones
  - Validación de email
  - Validación de contraseña (mínimo 6 caracteres)
  - Mensajes de error
  - Redirección después de login exitoso
  - Enlace a registro

### 5. Componente Register
- **Archivos**:
  - `frontend/src/app/views/pages/register/register.component.ts`
  - `frontend/src/app/views/pages/register/register.component.html`
- **Funcionalidades**:
  - Formulario reactivo con validaciones
  - Validación de email único
  - Confirmación de contraseña
  - Selector de tipo de usuario (Admin/Cobrador)
  - Mensajes de éxito y error
  - Redirección automática después de registro

### 6. Configuración
- **app.config.ts**: Configurado con interceptor de autenticación
- **app.routes.ts**: Rutas protegidas con authGuard

## 📋 Tareas Pendientes (Backend)

### 1. Crear endpoints de autenticación en el backend

```typescript
// backend/routes/auth.ts
import { Router } from 'express';
import { login, register } from '../controllers/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);

export default router;
```

### 2. Agregar rutas en index.ts

```typescript
// backend/index.ts
import authRoutes from './routes/auth';

app.use('/api/auth', authRoutes);
```

### 3. Instalar dependencias necesarias

```bash
cd backend
npm install bcrypt jsonwebtoken
npm install --save-dev @types/bcrypt @types/jsonwebtoken
```

### 4. Agregar campo password al modelo Usuario

```typescript
// backend/models/usuario.ts
password: {
  type: DataTypes.STRING,
  allowNull: false
}
```

### 5. Crear variable de entorno para JWT_SECRET

```
# backend/.env
JWT_SECRET=tu-clave-secreta-muy-segura-y-larga
```

### 6. Implementar controlador auth.ts
- Ver archivo de ejemplo: `EJEMPLO-auth-backend.ts`

## 🔒 Uso del Sistema de Autenticación

### En componentes que necesiten autenticación:

```typescript
import { AuthService } from './services/auth.service';

constructor(private authService: AuthService) {
  // Suscribirse al usuario actual
  this.authService.currentUser$.subscribe(user => {
    console.log('Usuario actual:', user);
  });

  // Verificar si está autenticado
  if (this.authService.isAuthenticated()) {
    // Usuario autenticado
  }

  // Obtener usuario
  const user = this.authService.getCurrentUser();

  // Verificar roles
  if (this.authService.isAdmin()) {
    // Es administrador
  }
}

// Hacer logout
logout() {
  this.authService.logout();
}
```

### Para proteger rutas:

```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, adminGuard]
}
```

## 🎯 Próximos pasos

1. Implementar los endpoints de autenticación en el backend
2. Actualizar el modelo Usuario con el campo password
3. Probar el flujo completo de registro y login
4. Implementar recuperación de contraseña (opcional)
5. Agregar funcionalidad de "recordarme" (opcional)
