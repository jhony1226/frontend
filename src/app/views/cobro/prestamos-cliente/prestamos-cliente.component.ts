import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ListPrestamoComponent } from '../../prestamo/list-prestamo/list-prestamo.component';

@Component({
  selector: 'app-prestamos-cliente',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ListPrestamoComponent
  ],
  templateUrl: './prestamos-cliente.component.html',
  styleUrls: ['./prestamos-cliente.component.scss']
})
export class PrestamosClienteComponent implements OnInit {
  clienteId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clienteId = +params['id'];
    });
  }

  volver(): void {
    this.router.navigate(['/cobro/crear-cobro']);
  }
}
