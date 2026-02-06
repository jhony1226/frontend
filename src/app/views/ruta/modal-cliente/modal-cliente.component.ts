import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-modal-cliente',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.scss']
})
export class ModalClienteComponent implements OnInit {
  clientesTotales: any[] = [];
  clientesFiltrados: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private dialogRef: MatDialogRef<ModalClienteComponent>
  ) {}

  ngOnInit() {
    this.clienteService.getClientes().subscribe(data => {
      this.clientesTotales = data;
      this.clientesFiltrados = data;
    });
  }

  filtrarClientes(event: any) {
    const busqueda = event.target.value.toLowerCase();
    this.clientesFiltrados = this.clientesTotales.filter(c => 
      (c.nombres && c.nombres.toLowerCase().includes(busqueda)) || 
      (c.dni && c.dni.includes(busqueda))
    );
  }

  seleccionar(cliente: any) {
    // Al cerrar el modal, devolvemos el cliente seleccionado al componente de la Ruta
    this.dialogRef.close(cliente);
  }
}