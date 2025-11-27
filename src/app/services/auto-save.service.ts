import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {

  /**
   * Guarda automáticamente los valores del formulario en localStorage
   * @param formGroup - El FormGroup a guardar
   * @param storageKey - Clave única para identificar el formulario en localStorage
   * @param debounceMs - Tiempo de espera en milisegundos antes de guardar (default: 1000ms)
   */
  enableAutoSave(formGroup: FormGroup, storageKey: string, debounceMs: number = 1000): void {
    // Suscribirse a los cambios del formulario con debounce
    formGroup.valueChanges
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.saveForm(formGroup, storageKey);
      });
  }

  /**
   * Guarda manualmente el formulario
   * @param formGroup - El FormGroup a guardar
   * @param storageKey - Clave única para identificar el formulario
   */
  saveForm(formGroup: FormGroup, storageKey: string): void {
    try {
      const formValue = formGroup.value;
      localStorage.setItem(storageKey, JSON.stringify(formValue));
      console.log(`Formulario guardado: ${storageKey}`, formValue);
    } catch (error) {
      console.error('Error al guardar el formulario:', error);
    }
  }

  /**
   * Restaura los valores guardados del formulario
   * @param formGroup - El FormGroup a restaurar
   * @param storageKey - Clave única para identificar el formulario
   * @returns true si se restauraron datos, false si no había datos guardados
   */
  restoreForm(formGroup: FormGroup, storageKey: string): boolean {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const formValue = JSON.parse(savedData);
        formGroup.patchValue(formValue, { emitEvent: false });
        console.log(`Formulario restaurado: ${storageKey}`, formValue);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al restaurar el formulario:', error);
      return false;
    }
  }

  /**
   * Limpia los datos guardados del formulario
   * @param storageKey - Clave única para identificar el formulario
   */
  clearSavedForm(storageKey: string): void {
    try {
      localStorage.removeItem(storageKey);
      console.log(`Datos del formulario eliminados: ${storageKey}`);
    } catch (error) {
      console.error('Error al limpiar el formulario:', error);
    }
  }

  /**
   * Verifica si hay datos guardados para un formulario
   * @param storageKey - Clave única para identificar el formulario
   * @returns true si hay datos guardados, false si no
   */
  hasSavedData(storageKey: string): boolean {
    return localStorage.getItem(storageKey) !== null;
  }

  /**
   * Obtiene los datos guardados sin restaurar el formulario
   * @param storageKey - Clave única para identificar el formulario
   * @returns Los datos guardados o null si no hay datos
   */
  getSavedData(storageKey: string): any {
    try {
      const savedData = localStorage.getItem(storageKey);
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error al obtener los datos guardados:', error);
      return null;
    }
  }
}

