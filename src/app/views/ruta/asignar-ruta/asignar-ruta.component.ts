import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule, moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalClienteComponent } from '../modal-cliente/modal-cliente.component';
import { RutasService } from '../../../services/rutas.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-asignar-ruta',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './asignar-ruta.component.html',
  styleUrls: ['./asignar-ruta.component.scss']
})
export class AsignarRutaComponent {
  nombreRuta = 'Centro Histórico';
  clientesAsignados: any[] = []; // Aquí cargas tus 100 clientes
  ordenModificado = false;
  idRutaActual!: number;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private RutasService: RutasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtenemos el ID de la ruta desde los parámetros de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idRutaActual = Number(id);
       
    }
  }

  // Maneja el arrastre visual
  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.clientesAsignados, event.previousIndex, event.currentIndex);
      this.ordenModificado = true;
    }
  }

  abrirModalClientes() {
    const dialogRef = this.dialog.open(ModalClienteComponent, {
      width: '450px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(clienteSeleccionado => {
      if (clienteSeleccionado) {
        // Verificar si ya existe en la lista para evitar duplicados
        const existe = this.clientesAsignados.some(c => c.cliente_id === clienteSeleccionado.cliente_id);
        
        if (!existe) {
          this.clientesAsignados.push(clienteSeleccionado);
          this.ordenModificado = true;
          this.snackBar.open(`${clienteSeleccionado.nombres} añadido a la ruta`, 'OK', { duration: 3000 });
        } else {
          this.snackBar.open('Este cliente ya está en la ruta', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  // Maneja el movimiento directo (Opción 1)
  moverAPosicion(indexActual: number) {
    const promptValue = prompt(`Mover a "${this.clientesAsignados[indexActual].nombres}" a la posición:`, (indexActual + 1).toString());
    
    if (promptValue) {
      const nuevaPos = parseInt(promptValue, 10) - 1;

      if (isNaN(nuevaPos) || nuevaPos < 0 || nuevaPos >= this.clientesAsignados.length) {
        this.snackBar.open('Posición inválida', 'Cerrar', { duration: 3000 });
        return;
      }

      moveItemInArray(this.clientesAsignados, indexActual, nuevaPos);
      this.ordenModificado = true;
      this.snackBar.open(`Cliente movido a la posición ${nuevaPos + 1}`, 'OK', { duration: 2000 });
    }
  }

  quitarDeRuta(index: number) {
    const cliente = this.clientesAsignados[index];
    if (confirm(`¿Quitar a ${cliente.nombres} de esta ruta?`)) {
      this.clientesAsignados.splice(index, 1);
      this.ordenModificado = true;
      this.snackBar.open('Cliente removido', 'Deshacer', { duration: 3000 }).onAction().subscribe(() => {
        this.clientesAsignados.splice(index, 0, cliente);
      });
    }
  }

  guardarOrden() {
  // 1. Preparamos el cuerpo de la petición (Payload)
  // Mapeamos para enviar el ID del cliente y su nuevo índice (+1 para que empiece en 1)
  const payload = this.clientesAsignados.map((cliente, index) => ({
    cliente_id: cliente.cliente_id, // Asegúrate que el nombre coincida con tu objeto
    orden: index + 1
  }));

  console.log('Enviando al backend:', payload);

  // 2. Llamamos al servicio (Suponiendo que tienes un RutaService)
  this.RutasService.actualizarOrdenClientes(this.idRutaActual, payload).subscribe({
    next: (res:any) => {
      this.ordenModificado = false;
      this.snackBar.open('¡Orden de ruta guardado exitosamente!', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    },
    error: (err: any) => {
      console.error('Error al guardar orden:', err);
      this.snackBar.open('Error al guardar el nuevo orden', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  });
}

/*
  quitarDeRuta(index: number): void {
  const cliente = this.clientesAsignados[index];
  
  // Opcional: Confirmación antes de eliminar
  if (confirm(`¿Estás seguro de quitar a ${cliente.nombres} de esta ruta?`)) {
    // Eliminamos el elemento del array
    this.clientesAsignados.splice(index, 1);
    
    // Marcamos que el orden ha cambiado para habilitar el botón "Guardar"
    this.ordenModificado = true;
    
    this.snackBar.open('Cliente removido de la ruta', 'OK', {
      duration: 3000
    });
  }
}*/

}