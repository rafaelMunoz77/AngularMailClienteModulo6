import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMensajesComponent } from './listado-mensajes.component';

describe('ListadoMensajesComponent', () => {
  let component: ListadoMensajesComponent;
  let fixture: ComponentFixture<ListadoMensajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoMensajesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoMensajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
