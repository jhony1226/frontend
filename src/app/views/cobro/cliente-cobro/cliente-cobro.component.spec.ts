import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCobroComponent } from './cliente-cobro.component';

describe('ClienteCobroComponent', () => {
  let component: ClienteCobroComponent;
  let fixture: ComponentFixture<ClienteCobroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCobroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
