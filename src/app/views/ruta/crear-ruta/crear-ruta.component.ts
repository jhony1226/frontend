import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ModalComponent,
  ModalModule,
  ButtonModule,
  ButtonCloseDirective,
} from '@coreui/angular';

@Component({
  selector: 'app-crear-ruta',
  templateUrl: './crear-ruta.component.html',
  styleUrls: ['./crear-ruta.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    ButtonModule,
    ButtonCloseDirective,
  ],
})
export class CrearRutaComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() rutaCreada = new EventEmitter<any>();
  @ViewChild('modalCrearRuta') modalCrearRuta?: ModalComponent;

  nombre: string = '';
  direccion: string = '';
  zona: string = '';
  estado: string = 'ACTIVO';

  onVisibleChange(newValue: boolean) {
    this.visible = newValue;
    this.visibleChange.emit(newValue);
    if (!newValue) {
      this.resetForm();
    }
  }

  crear() {
    // Validación mínima
    if (!this.nombre || !this.direccion || !this.zona) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    // Guardar en localStorage como demo
    const nuevaRuta = {
      id: Date.now(),
      nombre: this.nombre,
      direccion: this.direccion,
      zona: this.zona,
      estado: this.estado,
      createdAt: new Date().toISOString(),
    };
    const existentes = JSON.parse(localStorage.getItem('rutas') || '[]');
    existentes.push(nuevaRuta);
    localStorage.setItem('rutas', JSON.stringify(existentes));

    console.log('Ruta creada:', nuevaRuta);
    window.alert('Ruta creada exitosamente');
    this.rutaCreada.emit(nuevaRuta);
    this.cerrarModal();
  }

  cerrarModal() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  private resetForm() {
    this.nombre = '';
    this.direccion = '';
    this.zona = '';
    this.estado = 'ACTIVO';
  }
}
