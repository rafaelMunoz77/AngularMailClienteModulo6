import { ListadoMensajes, Mensaje, Usuario } from '../../interfaces/interfaces';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MensajeService } from '../../services/mensaje.service';
import { ComunicacionDeAlertasService } from '../../services/comunicacion-de-alertas.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from '../../services/usuario.service';

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
export class ListadoMensajesComponent implements OnInit, AfterViewInit {
  usuarioAutenticado: Usuario; // Mantenemos aquí al usuario autenticado en la aplicación, será útil
  nombresDeColumnas: string[] = ['De', 'Asunto', 'Fecha'];  // Etiquetas a mostrar en la tabla
  listadoMensajes: ListadoMensajes = {  // Estructura de datos recibidos desde el servidor.
    mensajes: [],
    totalMensajes: 0
  };
  tipoListadoMensajes: number = 0; // Indica mensajes recibidos. El código es  0 -> Recibidos  1 -> Enviados
                                    // 2 -> SPAM    3-> Archivados
  // Las tablas en material funcionan con su propio origen de datos, llamado MatTableDataSource, basado en 
  // rows (filas). Nosotros parametrizamos el MatTableDataSource para indicar que recibimos datos de tipo 
  // "Mensaje" y en el constructor del MatTableDataSource pasamos el array de mensajes
  dataSourceTabla = new MatTableDataSource<Mensaje>(this.listadoMensajes.mensajes);

  /**
   * A través del constructor llamo al inyector de objetose
   */
  constructor(private mensajesService: MensajeService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private usuarioService: UsuarioService,
    private router: Router) { }

  /**
   * Hook a la inicialización del componente, compruebo si el usuario está autenticado, si no lo
   * está le remito a la pantalla de Login.
   */
  ngOnInit(): void {
    // No se pueden obtener mensajes si no hay un usuario autenticado
    this.usuarioService.getUsuarioAutenticado().subscribe(usuario => {
      if (usuario == null) { // Si no hay usuario autenticado, redirijo al login
        this.router.navigate(['/login']);
      }
      else {
        this.usuarioAutenticado = usuario;
      }
    });
  }

  /**
   * Hook a un momento del ciclo de vida del componente. Se lanza una vez que el componente se comienza
   * a mostrar
   */
  ngAfterViewInit() {
    this.actualizaListadoMensajes();
  }

  /**
   * Realiza la petición de listado de mensajes al servidor y los asigna a la propiedad "listadoMensajes"
   * de esta clase
   */
  actualizaListadoMensajes() {
    this.comunicacionAlertas.abrirDialogCargando(); // Pantalla de carga
    // Petición de mensajes al servicio
    this.mensajesService.getListadoMensajes(this.tipoListadoMensajes, 0, 10).subscribe(data => {
      if (data["result"] == "fail") { // Algo ha fallado
        this.comunicacionAlertas.abrirDialogError('Imposible obtener los mensajes desde el servidor');
      }
      else { // Todo ha ido bien, se refresca el dataSourceTabla, con un nuevo MatTableDataSource.
        this.listadoMensajes = data;
        this.dataSourceTabla = new MatTableDataSource<Mensaje>(this.listadoMensajes.mensajes);
        this.comunicacionAlertas.cerrarDialogo();
      }
    });
  }

/**
 * Ejecutado este método cuando se hace click sobre una fila de la tabla. Como el MatTableDataSource está
 * construído con objetos de tip "Mensaje", cuando se hace click sobre una fila, en realidad, se hace click
 * sobre un mensaje.
 */
  seleccionarMensaje(mensaje: Mensaje) {
    console.log(mensaje);
  }

}
