import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenUsuarioComponent } from './imagen-usuario.component';

describe('ImagenUsuarioComponent', () => {
  let component: ImagenUsuarioComponent;
  let fixture: ComponentFixture<ImagenUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagenUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagenUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
