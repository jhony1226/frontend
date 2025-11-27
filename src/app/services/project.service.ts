import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  constructor() { }

  listProject(): Observable<any> {
    // TODO: Implementar llamada al API real
    // Por ahora retorna datos de ejemplo
    return of({
      projects: [],
      verifyPo: false
    });
  }

  findProject(id: string): Observable<any> {
    // TODO: Implementar llamada al API real
    return of({
      message: 'Project found',
      projectId: {
        _id: id,
        name: 'Project Name'
      }
    });
  }

  deleteProject(project: any): Observable<any> {
    // TODO: Implementar llamada al API real
    return of({
      message: 'Project deleted successfully'
    });
  }
}

