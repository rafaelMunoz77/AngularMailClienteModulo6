import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ComunicacionDeAlertasService } from '../../services/comunicacion-de-alertas.service';
import { Md5 } from 'ts-md5/dist/md5';


@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.scss']
})
/**
 * Esta clase permite que se cambie la contraseña del usuario por una nueva
 */
export class CambioPasswordComponent implements OnInit {
  form: FormGroup;
  hideActual = true;  // Utilizado para mostrar u ocultar la contraseña actual
  hideNueva = true;  // Utilizado para mostrar u ocultar la nueva contraseña

  /**
   * Constructor, con objetos instanciados por el inyector
   */
  constructor(
      private router: Router,
      private usuariosService: UsuarioService, 
      private comunicacionAlertas: ComunicacionDeAlertasService) {
  }
  
  /**
   * Inicializo el formulario reactivo
   */
  ngOnInit() {
    this.form = new FormGroup({
      actual: new FormControl ('', [Validators.required]),
      nueva: new FormControl ('', [Validators.required]),
    });

  }

  /**
   * Actualizo el password por uno nuevo
   */
  actualizarPassword() {
     // Compruebo si la contraseña escrita es real para el usuario autenticado
    this.comunicacionAlertas.abrirDialogCargando();
    var actualEncriptada = this.encriptaMD5(this.form.controls.actual.value); // Encripto la contraseña con MD5
    // Hago la petición al servicio de usuario, para ratificar la contraseña
    this.usuariosService.ratificaPasswordUsuarioAutenticado(actualEncriptada).subscribe(resultado => {
      console.log(resultado); // Por si quieres ver lo que llega del servidor
      if (resultado["result"] == 'fail') { // El servicio responde con un fallo al comprobar la contraseña
        this.comunicacionAlertas.abrirDialogError('La contraseña actual introducida no es válida o no se puede comprobar');
      }
      else { // Se ha ratificado la contraseña actual, se lanza el cambio de contraseña

        // Lanzo la llamada al cambio de contraseña
        var nuevaEncriptada = this.encriptaMD5(this.form.controls.nueva.value); // Encripto la nueva contraseña
        // Envio al servicio la petición de cambio de contraseña
        this.usuariosService.cambiaPasswordUsuarioAutenticado(nuevaEncriptada).subscribe(resultado => {
          if (resultado["result"] == 'fail') { // Se obtiene fallo
            this.comunicacionAlertas.abrirDialogError('Error al actualizar la contraseña. Inténtelo más tarde.')
          }
          else { // todo ok.
            this.comunicacionAlertas.abrirDialogInfo('Contraseña actualizada').subscribe(result => {
              this.router.navigate(['/listadoMensajes']); // Vuelvo al listado de mensajes
            });
          }
        })
      }
    });
  }

  /**
   * Encripta un texto en MD5
   */
  encriptaMD5 (texto: string) : string {
    const md5 = new Md5();
    return md5.appendStr(texto).end().toString();
  }

  /**
   * Cancela el cambio de contraseña, vuelve al listado de mensajes
   */
  cancelar () {
    this.router.navigate(['/listadoMensajes']);
  }
}
