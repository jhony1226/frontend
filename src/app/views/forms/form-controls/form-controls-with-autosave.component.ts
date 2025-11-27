import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ColDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  GutterDirective,
  RowComponent,
  RowDirective
} from '@coreui/angular';
import { DocsComponentsComponent, DocsExampleComponent } from '@docs-components/public-api';
import { AutoSaveService } from '../../../services/auto-save.service';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-form-controls-with-autosave',
  templateUrl: './form-controls-with-autosave.component.html',
  styleUrls: ['./form-controls.component.scss'],
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    DocsExampleComponent,
    ReactiveFormsModule,
    FormsModule,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
    RowDirective,
    GutterDirective,
    ColDirective,
    DocsComponentsComponent
  ]
})
export class FormControlsWithAutosaveComponent implements OnInit, OnDestroy {
  public favoriteColor = '#26ab3c';
  public form: FormGroup;
  public savedMessage = '';
  private destroy$ = new Subject<void>();
  private readonly STORAGE_KEY = 'form-controls-autosave';

  constructor(
    private fb: FormBuilder,
    private autoSaveService: AutoSaveService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      textarea: [''],
      favoriteColor: [this.favoriteColor]
    });
  }

  ngOnInit(): void {
    // Restaurar datos guardados al inicializar
    const hasRestored = this.autoSaveService.restoreForm(this.form, this.STORAGE_KEY);
    if (hasRestored) {
      this.savedMessage = 'Datos restaurados automáticamente';
      setTimeout(() => {
        this.savedMessage = '';
      }, 3000);
    }

    // Habilitar autoguardado con debounce de 1 segundo
    this.autoSaveService.enableAutoSave(this.form, this.STORAGE_KEY, 1000);

    // Mostrar mensaje cuando se guarda
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(1000)
      )
      .subscribe(() => {
        this.savedMessage = 'Guardado automáticamente';
        setTimeout(() => {
          this.savedMessage = '';
        }, 2000);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      // Limpiar datos guardados después de enviar
      this.autoSaveService.clearSavedForm(this.STORAGE_KEY);
      this.savedMessage = 'Formulario enviado y datos guardados eliminados';
      setTimeout(() => {
        this.savedMessage = '';
      }, 3000);
    } else {
      console.log('Formulario inválido');
    }
  }

  onClearSaved(): void {
    this.autoSaveService.clearSavedForm(this.STORAGE_KEY);
    this.form.reset();
    this.savedMessage = 'Datos guardados eliminados';
    setTimeout(() => {
      this.savedMessage = '';
    }, 2000);
  }
}

