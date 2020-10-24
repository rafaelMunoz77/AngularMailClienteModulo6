import { Component, OnInit } from '@angular/core';
import { MensajeService } from '../../services/mensaje.service';

/**
 * Decorador que permite que esta clase sea un componente, se debe especificar:
 * - Un selector para poder utilizarlo en HTML y otros muchos lugares
 * - Un "template", un fichero HTML que muestre la cara de este componente
 * - Una hoja de estilos.
 */
@Component({
  selector: 'app-listado-mensajes',
  templateUrl: './listado-mensajes.component.html',
  styleUrls: ['./listado-mensajes.component.scss']
})

/**
 * Esta clase contiene toda la lógica asociada al componente que permite mostrar y operar con los
 * mensajes del usuario autenticado.
 */
export class ListadoMensajesComponent implements OnInit {

  /**
   * A través del constructor llamo al inyector de objetos y le pido uno de tipo MensajeService
   */
  constructor(private mensajeService: MensajeService) { }

  /**
   * Hook a la inicialización del componente, lo usaré para pedir un listado de mensajes
   */
  ngOnInit(): void {
    this.mensajeService.getListadoMensajes(0, 10).subscribe(data => {
      console.log(data);
    });
  }

}
