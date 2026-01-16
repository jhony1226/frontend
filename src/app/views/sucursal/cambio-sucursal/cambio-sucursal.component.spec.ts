import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioSucursalComponent } from './cambio-sucursal.component';

describe('CambioSucursalComponent', () => {
  let component: CambioSucursalComponent;
  let fixture: ComponentFixture<CambioSucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambioSucursalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CambioSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
