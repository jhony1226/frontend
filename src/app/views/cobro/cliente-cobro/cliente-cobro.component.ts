import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-cobro',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './cliente-cobro.component.html',
  styleUrls: ['./cliente-cobro.component.scss']
})
export class ClienteCobroComponent implements OnInit {
  clientes: any[] = [];
  displayedColumns: string[] = ['nombre', 'direccion', 'telefono', 'accion'];

  constructor(
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
     
  }

   

  verDetalles(cliente: any): void {
    // Implementar navegación a detalles o cobro
    console.log('Ver detalles de:', cliente);
  }
}
