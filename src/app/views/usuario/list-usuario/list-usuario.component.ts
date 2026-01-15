import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { UsuarioService, Usuario } from '../../../services/usuario.service';

export interface Usuario_OLD {
  usuario_id: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  email?: string;
  tipo_usuario: number;
  tipoUsuarioNombre?: string;
  estado: string;
}

@Component({
  selector: 'app-list-usuario',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.scss']
})
export class ListUsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['nombres', 'apellidos', 'telefono', 'email', 'rol', 'estado', 'acciones'];

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  crearUsuario(): void {
    this.router.navigate(['/usuario/crear']);
  }

  editarUsuario(usuario: Usuario): void {
    this.router.navigate(['/usuario/editar', usuario.usuario_id]);
  }

  verDetalles(usuario: Usuario): void {
    console.log('Ver detalles:', usuario);
  }
}
