import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearRutaComponent } from '../crear-ruta/crear-ruta.component';

@Component({
  selector: 'app-list-ruta',
  standalone: true,
  imports: [CommonModule, CrearRutaComponent],
  templateUrl: './list-ruta.component.html',
  styleUrls: ['./list-ruta.component.css'],
})
export class ListRutaComponent implements OnInit {
  rutas: any[] = [];
  modalVisible: boolean = false;

  ngOnInit() {
    this.cargarRutas();
  }

  cargarRutas() {
    const rutasGuardadas = localStorage.getItem('rutas');
    this.rutas = rutasGuardadas ? JSON.parse(rutasGuardadas) : [];
  }

  abrirModalCrearRuta() {
    this.modalVisible = true;
  }

  onRutaCreada(nuevaRuta: any) {
    this.cargarRutas();
  }

  onModalVisibleChange(visible: boolean) {
    this.modalVisible = visible;
  }

  eliminarRuta(id: number) {
    if (confirm('¿Deseas eliminar esta ruta?')) {
      this.rutas = this.rutas.filter((r) => r.id !== id);
      localStorage.setItem('rutas', JSON.stringify(this.rutas));
    }
  }
}
