import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PrestamoService, PrestamoCobros, CobroDetalle } from '../../../services/prestamo.service';
import { CobroService, CreateCobroDto } from '../../../services/cobro.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

interface Pago {
  fecha: string;
  abono: number;
  estado: 'PAGADO' | 'PARCIAL' | 'Pendiente';
}

@Component({
  selector: 'app-tarjeta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.scss']
})
export class TarjetaComponent implements OnInit {

  // ============================
  // Estado UI
  // ============================
  montoRecibido: number = 0;
  prestamoId!: number;
  clienteId!: number;
  userId: number | null = null;
  isLoading: boolean = true;

  displayedColumns: string[] = ['fecha', 'abono', 'estado'];

  // ============================
  // Datos del cliente
  // ============================
  cliente = {
    nombre: '',
    prestamoId: '',
    ruta: 'Centro - Lunes'
  };

  // ============================
  // Resumen del préstamo
  // ============================
  resumen = {
    cuotaDelDia: 0,
    pagadoHoy: 0,
    saldoTotalPrestamo: 0
  };

  // ============================
  // Historial de pagos
  // ============================
  pagos: Pago[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prestamoService: PrestamoService,
    private cobroService: CobroService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Obtener usuario autenticado
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.snackBar.open('Debe iniciar sesión para realizar cobros', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.router.navigate(['/login']);
      return;
    }
    this.userId = currentUser.id;

    // Obtener prestamoId de los query params
    this.route.queryParams.subscribe(params => {
      this.prestamoId = +params['prestamoId'] || 1;
      this.cargarDatosPrestamo();
    });
  }

  cargarDatosPrestamo(): void {
    this.isLoading = true;
    this.prestamoService.getPrestamoCobros(this.prestamoId).subscribe({
      next: (data: PrestamoCobros) => {
        // Actualizar datos del cliente
        this.cliente.nombre = data.nombre_cliente;
        this.cliente.prestamoId = `#${data.id_prestamo}`;
        this.clienteId = data.id_prestamo; // Guardar para enviar al crear cobro

        // Actualizar resumen
        this.resumen.cuotaDelDia = parseFloat(data.valor_cuota);
        this.resumen.saldoTotalPrestamo = parseFloat(data.saldo_pendiente);

        // Convertir datos de cobros al formato de pagos
        this.pagos = data.data.map((cobro: CobroDetalle) => ({
          fecha: new Date(cobro.fecha_cobro).toLocaleDateString(),
          abono: parseFloat(cobro.monto_cobrado),
          estado: cobro.estado as 'PAGADO' | 'PARCIAL' | 'Pendiente'
        }));

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos del préstamo:', error);
        this.isLoading = false;
      }
    });
  }

  // ============================
  // Guardar pago del día
  // ============================
  guardarCobro(): void {
    if (!this.montoRecibido || this.montoRecibido <= 0) {
      this.snackBar.open('Por favor ingrese un monto válido', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    if (!this.userId) {
      this.snackBar.open('No se pudo identificar el usuario. Por favor inicie sesión nuevamente.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.router.navigate(['/login']);
      return;
    }

    // Mostrar diálogo de confirmación
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Confirmar cobro',
        message: `¿Está seguro de que desea registrar un cobro de <b>$${this.montoRecibido.toFixed(2)}</b>?`,
        confirmText: 'Guardar',
        cancelText: 'Cancelar',
        color: 'primary',
        icon: 'save',
        type: 'info'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.guardarCobroConfirmado();
      }
    });
  }

  private guardarCobroConfirmado(): void {
    const cobroData: CreateCobroDto = {
      prestamo_id: this.prestamoId,
      usuario_id: this.userId!,
      monto_cobrado: this.montoRecibido
    };

    console.log('Enviando cobro:', cobroData);
    console.log('URL:', 'https://appgdc.onrender.com/api/cobro/createCobro');
    console.log('Usuario actual ID:', this.userId);
    console.log('Préstamo ID:', this.prestamoId);

    this.cobroService.createCobro(cobroData).subscribe({
      next: (response) => {
        console.log('Cobro guardado exitosamente:', response);
        
        this.snackBar.open('Cobro guardado exitosamente', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        
        // Recargar la página después de mostrar el mensaje
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (error) => {
        console.error('Error completo:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Error body:', error.error);
        
        let errorMsg = 'Error al guardar el cobro.';
        if (error.status === 0) {
          errorMsg += ' No se puede conectar con el servidor.';
        } else if (error.status === 404) {
          errorMsg += ' Ruta no encontrada (404).';
        } else if (error.status === 403 || error.error?.error?.includes('cobrador asignado')) {
          errorMsg = 'No tiene permiso para registrar cobros de este préstamo. Solo el cobrador asignado puede hacerlo.';
        } else if (error.status === 500) {
          errorMsg += ' Error del servidor (500).';
        } else if (error.error?.error) {
          errorMsg += ' ' + error.error.error;
        }
        
        this.snackBar.open(errorMsg, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  // ============================
  // Volver al menú anterior
  // ============================
  volver(): void {
    this.router.navigate(['/cobro/crear-cobro']).catch(err => {
      console.error('Error al navegar:', err);
    });
  }

}
