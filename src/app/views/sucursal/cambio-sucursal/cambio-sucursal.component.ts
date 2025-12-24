import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cambio-sucursal',
  templateUrl: './cambio-sucursal.component.html',
  styleUrls: ['./cambio-sucursal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class CambioSucursalComponent {
  sucursales = [
    { id: 's1', name: 'Sucursal A' },
    { id: 's2', name: 'Sucursal B' },
    { id: 's3', name: 'Sucursal C' },
  ];

  selectedId: string | null = null;

  constructor(public router: Router) {
    this.selectedId = localStorage.getItem('sucursalId');
  }

  changeSucursal() {
    if (this.selectedId) {
      localStorage.setItem('sucursalId', this.selectedId);
      const selected = this.sucursales.find((s) => s.id === this.selectedId);
      localStorage.setItem('sucursalName', selected ? selected.name : '');
      // navigate back to list
      this.router.navigate(['/sucursal/list-sucursal']);
    } else {
      window.alert('Seleccione una sucursal antes de cambiar.');
    }
  }
}
