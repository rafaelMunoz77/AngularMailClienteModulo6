import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataType, DialogTypes } from './dialog-data-type';


@Component({
  selector: 'app-dialogo-general',
  templateUrl: './dialogo-general.component.html',
  styleUrls: ['./dialogo-general.component.scss']
})
/**
 * Esta clase permite mostrar un díalogo en pantalla, para mostrar o preguntar al usuario.
 * Lo más llamativo es el decorador @Inject que va a indicar que este componente recibe
 * datos "inyectados" desde el lugar en el que alguien decida usarlo.
 * Los datos recibidos se denominan "data" (pero puede tener cualquier nombre) y corresponden
 * al tipo DialogDataType, que está definido en el fichero "dialog-data-type.ts" en esta misma
 * carpeta
 */
export class DialogoGeneralComponent {

  // La siguiente propiedad nos va a permitir acceder a las "constantes" definidas en el tipo
  // "DialogTypes", definido en el fichero "dialog-data-type.ts", en esta misma carpeta.
  public dialogTypesClass = DialogTypes;

  // La variable "data" será accesible desde el template (html) de este componente
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogDataType) { }
}
