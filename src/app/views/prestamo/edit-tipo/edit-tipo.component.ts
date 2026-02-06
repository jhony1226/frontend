import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoPrestamo } from '../../../services/tipoPrestamo.service';

@Component({
  selector: 'app-edit-tipo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-tipo.component.html',
  styleUrls: ['./edit-tipo.component.scss']
})
export class EditTipoComponent {
  @Input() tipoPrestamo: TipoPrestamo | null = null;
}
