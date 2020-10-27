import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMensajeComponent } from './detalle-mensaje.component';

describe('DetalleMensajeComponent', () => {
  let component: DetalleMensajeComponent;
  let fixture: ComponentFixture<DetalleMensajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleMensajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
