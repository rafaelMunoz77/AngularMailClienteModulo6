import { Component, Input } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-imagen-usuario',
  templateUrl: './imagen-usuario.component.html',
  styleUrls: ['./imagen-usuario.component.scss']
})
export class ImagenUsuarioComponent {

  // Las propiedades con el decorador Input son propiedades que pueden personalizar
  // este componente, desde fuera del mismo. Son propiedades que "entran" en él.
  @Input('usuario') usuario: Usuario;
  @Input('width') width: number;
  @Input('height') height: number;

  constructor() { }
}
