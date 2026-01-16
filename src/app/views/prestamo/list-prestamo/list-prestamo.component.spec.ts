import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrestamoComponent } from './list-prestamo.component';

describe('ListPrestamoComponent', () => {
  let component: ListPrestamoComponent;
  let fixture: ComponentFixture<ListPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPrestamoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});