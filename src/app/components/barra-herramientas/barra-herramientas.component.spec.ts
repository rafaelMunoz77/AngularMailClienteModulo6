import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraHerramientasComponent } from './barra-herramientas.component';

describe('BarraHerramientasComponent', () => {
  let component: BarraHerramientasComponent;
  let fixture: ComponentFixture<BarraHerramientasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarraHerramientasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarraHerramientasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
