import { Component} from '@angular/core';
import { ComunicacionDeAlertasService } from '../../services/comunicacion-de-alertas.service';
import { DialogTypes } from '../dialogo-general/dialog-data-type';
import { AutenticadorJwtService } from '../../services/autenticador-jwt.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-barra-herramientas',
  templateUrl: './barra-herramientas.component.html',
  styleUrls: ['./barra-herramientas.component.scss']
})
/**
 * Una barra de herramientas que se muestra en la parte superior de la aplicación. Contiene un menú
 * para el usuario autenticado.
 */
export class BarraHerramientasComponent {

  // Necesito varios objetos inyectados en este componente
  constructor(private comunicacionAlertasService: ComunicacionDeAlertasService,
    private autenticacionPorJWT: AutenticadorJwtService,
    private router: Router) { }

  /**
   * El logo de la barra de herramientas nos llevará al listado de mensajes
   */
  navegarHaciaPrincipal() {
    this.router.navigate(['/listadoMensajes']);
  } 
  
  /**
   * Confirmación de que deseamos abandonar la sesión
   */
  confirmacionAbandonarSesion() {
    this.comunicacionAlertasService.abrirDialogConfirmacion ('¿Realmente desea abandonar la sesión?').subscribe(opcionElegida => {
      if (opcionElegida == DialogTypes.RESPUESTA_ACEPTAR) {
        this.autenticacionPorJWT.eliminaJWT();
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Navegar hacia el componente de cambiar password
   */
  navegarHaciaCambiaPassword () {
  }


  /**
   * Navegar hacia el componente de modificación de los datos del usuario
   */
  navegarHaciaDatosPersonales () {
  }

}