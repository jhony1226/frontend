import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSucursalComponent } from './list-sucursal.component';

describe('ListSucursalComponent', () => {
  let component: ListSucursalComponent;
  let fixture: ComponentFixture<ListSucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSucursalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
