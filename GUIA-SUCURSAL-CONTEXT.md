# Guía de Implementación: Sucursal Context

## ✅ Implementación Completada

He implementado un sistema completo para mantener y enviar la sucursal seleccionada en todas las peticiones API.

## 📁 Archivos Creados/Modificados

### 1. **SucursalContextService** 
`frontend/src/app/services/sucursal-context.service.ts`

Servicio que gestiona la sucursal actual:
- Guarda en localStorage
- Observable para reactivity
- Métodos para get/set sucursal

### 2. **AuthInterceptor Actualizado**
`frontend/src/app/interceptors/auth.interceptor.ts`

Ahora incluye automáticamente:
- Header `Authorization: Bearer {token}`
- Header `X-Sucursal-Id: {sucursalId}` (si hay sucursal seleccionada)

### 3. **CambioSucursalComponent Actualizado**
`frontend/src/app/views/sucursal/cambio-sucursal/cambio-sucursal.component.ts`

Ahora usa el SucursalContextService para guardar la sucursal seleccionada.

### 4. **AuthService Actualizado**
`frontend/src/app/services/auth.service.ts`

El logout ahora limpia también la sucursal seleccionada.

## 🎯 Cómo Funciona

### Flujo de Trabajo:

1. **Usuario hace login** → Redirige a selección de sucursal
2. **Usuario selecciona sucursal** → Se guarda en:
   - localStorage (persistencia)
   - BehaviorSubject (reactivity)
3. **Cada petición HTTP** → Interceptor agrega automáticamente:
   ```
   Authorization: Bearer eyJhbGc...
   X-Sucursal-Id: 1
   ```

## 💻 Uso en Componentes

### Ejemplo 1: Obtener sucursal actual

```typescript
import { SucursalContextService } from '../services/sucursal-context.service';

export class MiComponente {
  constructor(private sucursalContext: SucursalContextService) {
    // Obtener sucursal actual
    const sucursal = this.sucursalContext.getSucursalActual();
    console.log('Sucursal actual:', sucursal);
    
    // Solo el ID
    const id = this.sucursalContext.getSucursalId();
    console.log('ID de sucursal:', id);
  }
}
```

### Ejemplo 2: Suscribirse a cambios de sucursal

```typescript
export class MiComponente implements OnInit {
  sucursalActual$ = this.sucursalContext.sucursalActual$;

  constructor(private sucursalContext: SucursalContextService) {}

  ngOnInit() {
    // Escuchar cambios de sucursal
    this.sucursalActual$.subscribe(sucursal => {
      if (sucursal) {
        console.log('Sucursal cambió a:', sucursal.nombre);
        // Recargar datos con la nueva sucursal
        this.cargarDatos();
      }
    });
  }
}
```

### Ejemplo 3: Validar que haya sucursal seleccionada

```typescript
export class MiComponente {
  constructor(
    private sucursalContext: SucursalContextService,
    private router: Router
  ) {}

  cargarDatos() {
    if (!this.sucursalContext.hasSucursalSeleccionada()) {
      this.router.navigate(['/sucursal/cambio-sucursal']);
      return;
    }
    
    // Continuar con la carga de datos
    this.miServicio.getData().subscribe(...);
  }
}
```

### Ejemplo 4: Establecer sucursal programáticamente

```typescript
export class MiComponente {
  constructor(private sucursalContext: SucursalContextService) {}

  seleccionarSucursal(sucursal: any) {
    this.sucursalContext.setSucursalActual({
      id: sucursal.sucursal_id,
      nombre: sucursal.nombre,
      direccion: sucursal.direccion
    });
  }
}
```

## 🔧 Backend: Leer el Header

En tu backend (Node.js/Express), puedes leer el header así:

```typescript
// En cualquier controlador
export const miControlador = (req: Request, res: Response) => {
  const sucursalId = req.headers['x-sucursal-id'];
  
  if (!sucursalId) {
    return res.status(400).json({ 
      message: 'Sucursal no especificada' 
    });
  }
  
  // Usar sucursalId en tu query
  const datos = await MiModelo.findAll({
    where: { sucursalId }
  });
  
  res.json(datos);
};
```

### Middleware para validar sucursal (opcional)

```typescript
// backend/middleware/validateSucursal.ts
export const validateSucursal = (req: Request, res: Response, next: any) => {
  const sucursalId = req.headers['x-sucursal-id'];
  
  if (!sucursalId) {
    return res.status(400).json({ 
      message: 'Header X-Sucursal-Id es requerido' 
    });
  }
  
  // Agregar al request para usarlo después
  (req as any).sucursalId = parseInt(sucursalId as string);
  next();
};

// Usar en rutas
router.get('/clientes', validateSucursal, getClientes);
```

## 📊 Estado de la Implementación

✅ Servicio de contexto creado
✅ Interceptor HTTP actualizado
✅ Componente cambio-sucursal actualizado
✅ Logout limpia sucursal
✅ Headers automáticos en todas las peticiones
✅ Persistencia en localStorage
✅ Observable para reactivity

## 🎨 Mejoras Opcionales

1. **Guard para verificar sucursal:**
```typescript
export const sucursalGuard: CanActivateFn = (route, state) => {
  const sucursalContext = inject(SucursalContextService);
  const router = inject(Router);

  if (!sucursalContext.hasSucursalSeleccionada()) {
    router.navigate(['/sucursal/cambio-sucursal']);
    return false;
  }
  return true;
};
```

2. **Mostrar sucursal actual en el header:**
```typescript
// En el header component
sucursalActual$ = this.sucursalContext.sucursalActual$;
```

```html
<div *ngIf="sucursalActual$ | async as sucursal">
  Sucursal: {{ sucursal.nombre }}
</div>
```

## 🔍 Debug

Para verificar que funciona:
1. Abre DevTools (F12) → Network
2. Haz una petición HTTP
3. Verifica los headers:
   - `Authorization: Bearer ...`
   - `X-Sucursal-Id: 1`
