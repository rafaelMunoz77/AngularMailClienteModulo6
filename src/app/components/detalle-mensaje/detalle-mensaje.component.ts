import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mensaje, Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { MensajeService } from '../../services/mensaje.service';
import { ComunicacionDeAlertasService } from '../../services/comunicacion-de-alertas.service';

@Component({
  selector: 'app-detalle-mensaje',
  templateUrl: './detalle-mensaje.component.html',
  styleUrls: ['./detalle-mensaje.component.scss']
})
export class DetalleMensajeComponent implements OnInit {

  usuarioRemitente: Usuario;
  usuarioAutenticado: Usuario;

  constructor(@Inject(MAT_DIALOG_DATA) public mensaje: Mensaje,
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<DetalleMensajeComponent>,
    private mensajeService: MensajeService,
    private comunicacionDeAlertas: ComunicacionDeAlertasService) { }

  /**
   * 
   */
  ngOnInit() {
    this.usuarioService.getUsuario(this.mensaje.remitente.id, true).subscribe(usuarioObtenido => {
      this.usuarioRemitente = usuarioObtenido;
    });
    this.usuarioService.getUsuarioAutenticado().subscribe(usuario => this.usuarioAutenticado = usuario);
    this.accionSobreMensajes(0);
  }

  /**
   * 
   */
  volver() {
    this.dialogRef.close();
  }

  /**
   * 
   */
  botonArchivarHabilitado() {
    return (!this.mensaje.archivado && !this.mensaje.spam && this.usuarioAutenticado != null && this.usuarioAutenticado.id != this.mensaje.remitente.id);
  }

  /**  
   * 
   */
  botonSpamHabilitado() {
    return (!this.mensaje.archivado && !this.mensaje.spam && this.usuarioAutenticado != null &&  this.usuarioAutenticado.id != this.mensaje.remitente.id);
  }

  /**
   * 
   */
  botonEliminarHabilitado() {
    return (this.mensaje.fechaEliminacion == null && this.usuarioAutenticado != null &&  this.usuarioAutenticado.id != this.mensaje.remitente.id);
  }

  /**
   * 
   */
  botonMoverARecibidosHabilitado() {
    return (this.mensaje.archivado || this.mensaje.spam);
  }

  /**
   * El tipo de marca determina la acción a realizar sobre los mensajes
	 * 		0 -> marca como mensajes leídos
	 * 		1 -> marca como mensajes archivados
	 * 		2 -> marca como mensajes spam
	 * 		3 -> marca como mensajes eliminados
	 * 		4 -> mueve el mensaje a "recibidos", elimina las marcas de "leído", "archivado", "spam" y "eliminado"
   */
  accionSobreMensajes(tipoAccion: number) {
    this.mensajeService.accionSobreMensajes([this.mensaje.id], tipoAccion).subscribe(strResult => {
      if (strResult['result'] == 'fail') {
        if (tipoAccion != 0) {
          this.comunicacionDeAlertas.mostrarSnackBar('Error al realizar la operación. Inténtelo más tarde.')
        }
      }
      else {
        if (tipoAccion != 0) {
          this.volver();
        }
      }
    });
  }
}
