import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogoGeneralComponent } from '../components/dialogo-general/dialogo-general.component';
import { DialogTypes } from '../components/dialogo-general/dialog-data-type';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})

// Este servicio se utiliza para controlar un componente denominado "dialogo-general".
// Mediante los métodos de este servicio controlaremos que se abra en pantalla un dialogo
// que muestre información, errores, progreso o confirmación de alguna información.
// Además también se incorpora un método para cerrar el dialogo en cualquier momento
export class ComunicacionDeAlertasService {
  
  dialogConfig = new MatDialogConfig();

  // Necesito un componente de tipo MatDialog (de Angular) para mostrar en pantalla un diálogo
  constructor(private dialog: MatDialog,
    private snackBar: MatSnackBar) {
    this.dialogConfig.disableClose = true; // El dialogo no se cerrará automaticamente
    this.dialogConfig.autoFocus = true; // El foco de la aplicación pasará directamente al dialogo
   }

  /**
   * Dialogo para mostrar una pequeña animación, basada en el componente de angular "Progress Spinner"
  */ 
  abrirDialogCargando() {
    this.cerrarDialogo(); // Si existe un diálogo en pantalla, lo cierra
    this.dialogConfig.data = {
      tipoDialogo: DialogTypes.ESPERANDO // Especifica un tipo de dialogo, creado por mí
    };
    this.dialog.open(DialogoGeneralComponent, this.dialogConfig); // abre el diálogo
  }

  /**
   * Diálogo para mostrar un mensaje de error en pantalla
   */
  abrirDialogError(textoDeError: string) {
    this.cerrarDialogo(); // Cierro el diálogo, si se está mostrando
    this.dialogConfig.data = {
      tipoDialogo: DialogTypes.ERROR, // Configuro un tipo de error, creado por mí
      texto: textoDeError 
    };
    this.dialog.open(DialogoGeneralComponent, this.dialogConfig); // abro el diálogo
  }

  /**
   * Diálogo para mostrar una información en pantalla. El método devuelve un observable que
   * permite que sepamos en qué momento se cierra el diálogo. Esto es útil para mostrar un texto
   * y, por ejemplo, no avanzar hasta otra página mientras el diálogo esté en pantalla.
   */
  abrirDialogInfo(textoDeInfo: string): Observable<number> {
    this.cerrarDialogo();
    this.dialogConfig.data = {  
      tipoDialogo: DialogTypes.INFORMACION,
      texto: textoDeInfo
    };
    // Abro el diálogo pero obtengo una referencia al mismo.
    const dialogRef = this.dialog.open(DialogoGeneralComponent, this.dialogConfig);
    // Devuelvo el evento "afterClosed", que permite subscripción
    return dialogRef.afterClosed();
  }

  /**
   * Abro un diálogo para confirmar un mensaje al usuario. Podrá elegir entre diferentes
   * opciones. El método devuelve un Observable, para saber qué opción se ha elegido.
   */
  abrirDialogConfirmacion (textoDeConfirmacion: string): Observable<number> {
    this.cerrarDialogo();
    this.dialogConfig.data = {
      tipoDialogo: DialogTypes.CONFIRMACION,
      texto: textoDeConfirmacion
    };
    // Al igual que el método anterior, obtengo una referencia al diálogo abierto para poder
    // devolver un Observable al que subscribirnos
    const dialogRef = this.dialog.open(DialogoGeneralComponent, this.dialogConfig);
    return dialogRef.afterClosed();
  }

  /**
   * 
   */
  cerrarDialogo() {
    this.dialog.closeAll();
  }


  /**
   * Muestra un pequeño cartel de información, que dura 2 segundos en pantalla
   */
  mostrarSnackBar(mensajeAMostrar: string) {
    this.snackBar.open(mensajeAMostrar, null, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
