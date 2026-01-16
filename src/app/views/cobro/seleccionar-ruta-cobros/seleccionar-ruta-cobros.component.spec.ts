import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionarRutaCobrosComponent } from './seleccionar-ruta-cobros.component';

describe('SeleccionarRutaCobrosComponent', () => {
  let component: SeleccionarRutaCobrosComponent;
  let fixture: ComponentFixture<SeleccionarRutaCobrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarRutaCobrosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeleccionarRutaCobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
