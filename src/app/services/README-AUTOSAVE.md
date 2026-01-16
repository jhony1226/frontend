# Servicio de Autoguardado

Este servicio permite guardar automáticamente los datos de formularios en `localStorage` y restaurarlos cuando el usuario vuelve a la página.

## Características

- ✅ Guardado automático con debounce (evita guardar en cada tecla)
- ✅ Restauración automática al cargar el componente
- ✅ Limpieza de datos guardados
- ✅ Verificación de datos guardados
- ✅ Fácil de usar en cualquier formulario

## Uso Básico

### 1. Importar el servicio

```typescript
import { AutoSaveService } from '../../../services/auto-save.service';
```

### 2. Inyectar en el constructor

```typescript
constructor(
  private autoSaveService: AutoSaveService
) {}
```

### 3. Habilitar autoguardado en ngOnInit

```typescript
ngOnInit(): void {
  // Restaurar datos guardados al inicializar
  this.autoSaveService.restoreForm(this.form, 'mi-formulario-key');
  
  // Habilitar autoguardado (guarda después de 1 segundo de inactividad)
  this.autoSaveService.enableAutoSave(this.form, 'mi-formulario-key', 1000);
}
```

## Ejemplo Completo

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoSaveService } from '../../../services/auto-save.service';

@Component({
  selector: 'app-mi-formulario',
  templateUrl: './mi-formulario.component.html'
})
export class MiFormularioComponent implements OnInit {
  form: FormGroup;
  private readonly STORAGE_KEY = 'mi-formulario-key';

  constructor(
    private fb: FormBuilder,
    private autoSaveService: AutoSaveService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Restaurar datos guardados
    const hasRestored = this.autoSaveService.restoreForm(this.form, this.STORAGE_KEY);
    if (hasRestored) {
      console.log('Datos restaurados automáticamente');
    }

    // Habilitar autoguardado (guarda después de 1 segundo sin cambios)
    this.autoSaveService.enableAutoSave(this.form, this.STORAGE_KEY, 1000);
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Limpiar datos guardados después de enviar
      this.autoSaveService.clearSavedForm(this.STORAGE_KEY);
      console.log('Formulario enviado:', this.form.value);
    }
  }
}
```

## Métodos Disponibles

### `enableAutoSave(formGroup, storageKey, debounceMs?)`
Habilita el autoguardado automático del formulario.

- `formGroup`: El FormGroup a guardar
- `storageKey`: Clave única para identificar el formulario
- `debounceMs`: Tiempo de espera antes de guardar (default: 1000ms)

### `saveForm(formGroup, storageKey)`
Guarda manualmente el formulario.

### `restoreForm(formGroup, storageKey)`
Restaura los valores guardados del formulario. Retorna `true` si se restauraron datos.

### `clearSavedForm(storageKey)`
Elimina los datos guardados del localStorage.

### `hasSavedData(storageKey)`
Verifica si hay datos guardados. Retorna `true` o `false`.

### `getSavedData(storageKey)`
Obtiene los datos guardados sin restaurar el formulario.

## Notas Importantes

- Usa claves únicas para cada formulario (`storageKey`)
- El debounce evita guardar en cada tecla presionada
- Los datos se guardan en `localStorage` del navegador
- Limpia los datos guardados después de enviar el formulario exitosamente






