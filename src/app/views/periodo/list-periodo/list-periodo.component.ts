import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-periodo',
  templateUrl: './list-periodo.component.html',
  styleUrls: ['./list-periodo.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatSelectModule,
  ],
})
export class ListPeriodoComponent implements OnInit {
  displayedColumns: string[] = [
    'asociado',
    'valor',
    'fechas',
    'estado',
    'acciones',
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  projectData: any;
  message: string = '';

  constructor(public _projectService: ProjectService, private _router: Router) {
    this.projectData = {};
    this.dataSource = new MatTableDataSource(this.projectData);
  }

  ngOnInit(): void {
    /*
    this._projectService.listProject().subscribe({
      next: (v) => {
        this.projectData = v.projects;
        this.dataSource = new MatTableDataSource(this.projectData);
        this.dataSource.paginator = this.paginator;
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
    });*/
    this.loadLocalData();
  }

  loadLocalData() {
    const data = [
      {
        _id: '1',
        asociado: 'Constructora Bolívar',
        valor: 150000000,
        fechaInicio: new Date('2025-01-01'),
        fechaFin: new Date('2025-06-30'),
        estado: 'ACTIVO',
      },
      {
        _id: '2',
        asociado: 'Arquitectura y Concreto',
        valor: 75000000,
        fechaInicio: new Date('2024-06-01'),
        fechaFin: new Date('2024-12-31'),
        estado: 'CERRADO',
      },
      {
        _id: '3',
        asociado: 'Inversiones Los Andes',
        valor: 4200000,
        fechaInicio: new Date('2023-01-01'),
        fechaFin: new Date('2023-02-28'),
        estado: 'VENCIDO',
      },
      {
        _id: '4',
        asociado: 'Grupo Bancolombia',
        valor: 500000000,
        fechaInicio: new Date('2025-03-01'),
        fechaFin: new Date('2025-12-30'),
        estado: 'ACTIVO',
      },
      {
        _id: '5',
        asociado: 'Fundación EPM',
        valor: 12000000,
        fechaInicio: new Date('2024-01-15'),
        fechaFin: new Date('2024-05-15'),
        estado: 'CERRADO',
      },
      {
        _id: '6',
        asociado: 'Tech Solutions SAS',
        valor: 8500000,
        fechaInicio: new Date('2025-02-01'),
        fechaFin: new Date('2025-04-01'),
        estado: 'ACTIVO',
      },
      {
        _id: '7',
        asociado: 'Comfama',
        valor: 35000000,
        fechaInicio: new Date('2023-08-01'),
        fechaFin: new Date('2023-11-30'),
        estado: 'VENCIDO',
      },
    ];

    this.projectData = data;
    this.dataSource = new MatTableDataSource(this.projectData);

    // Es importante asignar el paginator después de cargar los datos
    // Usamos setTimeout para asegurar que la vista ya renderizó el paginator
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  fintProject(_id: any, root: any) {
    this._projectService.findProject(_id).subscribe({
      next: (v) => {
        this.message = v.message;
        localStorage.setItem('nameProject', v.projectId.name);
        localStorage.setItem('projectId', v.projectId._id);
        this._router.navigate([root, _id]);
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
    });
  }

  listTeam(_id: any) {
    this._projectService.findProject(_id).subscribe({
      next: (v) => {
        this.message = v.message;
        localStorage.setItem('nameProject', v.projectId.name);
        localStorage.setItem('projectId', v.projectId._id);
        this._router.navigate(['/periodo/list-periodo']);
        this.openSnackBarSuccesfull();
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
    });
  }

  listProject(_id: any) {
    this._projectService.findProject(_id).subscribe({
      next: (v) => {
        this.message = v.message;
        localStorage.setItem('nameProject', v.projectId.name);
        localStorage.setItem('projectId', v.projectId._id);
        this.saveSprint(_id);
        this._router.navigate(['/periodo/list-periodo']);
        this.openSnackBarSuccesfull();
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByState(state: string) {
    if (!state) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = state;
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteProject = async (project: any) => {
    if (await this.deleteProjectSnackBar()) {
      this._projectService.deleteProject(project).subscribe({
        next: (v) => {
          let index = this.projectData.indexOf(project);
          if (index > -1) {
            this.projectData.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.projectData);
            this.dataSource.paginator = this.paginator;
            this.message = 'Delete Project';
            this.openSnackBarSuccesfull();
          }
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
      });
    }
  };

  delete = async (item: any) => {
    await this.deleteProject(item);
  };

  saveSprint(id: any) {
    localStorage.setItem('projectId', id);
  }
  pruebAlert(user: any) {}

  openSnackBarSuccesfull() {
    Swal.fire({
      icon: 'success',
      title: this.message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  openSnackBarError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: this.message,
    });
  }

  deleteProjectSnackBar = async () => {
    let res;
    await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      res = result.isConfirmed;
    });
    return res;
  };
}
