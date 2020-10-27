import { ListadoMensajes, Mensaje, Usuario } from '../../interfaces/interfaces';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MensajeService } from '../../services/mensaje.service';
import { ComunicacionDeAlertasService } from '../../services/comunicacion-de-alertas.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from '../../services/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { DetalleMensajeComponent } from '../detalle-mensaje/detalle-mensaje.component';
import { NuevoMensajeComponent } from '../nuevo-mensaje/nuevo-mensaje.component';



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
  nombresDeColumnas: string[] = ['Select', 'De', 'Asunto', 'Fecha'];  // Etiquetas a mostrar en la tabla
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
  // Lista de mensajes seleccionados. Cuando hagamos clic sobre el checkbox de cada mensaje, modificaremos
  // esta lista de mensajes seleccionados
  selection = new SelectionModel<Mensaje>(true, []);
  // El decorador @ViewChild permite acceder a un subelemento de este component, del tipo especificado. En
  // este caso es del tipo MatPaginator
  @ViewChild(MatPaginator) paginator: MatPaginator;


  /**
   * A través del constructor llamo al inyector de objetose
   */
  constructor(private mensajesService: MensajeService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private usuarioService: UsuarioService,
    private router: Router,
    private dialog: MatDialog) { }

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
    this.configuraEtiquetasDelPaginador();
    this.actualizaListadoMensajes();
  }

  /**
   * Configura las etiquetas y comportamiento del paginador
   */
  private configuraEtiquetasDelPaginador() {
    this.paginator._intl.itemsPerPageLabel = "Mensajes por página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.paginator._intl.firstPageLabel = "Primera";
    this.paginator._intl.lastPageLabel = "Última";
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length}`;
    };
  }

  /**
   * Realiza la petición de listado de mensajes al servidor y los asigna a la propiedad "listadoMensajes"
   * de esta clase
   */
  actualizaListadoMensajes() {
    this.comunicacionAlertas.abrirDialogCargando(); // Pantalla de carga
    // Petición de mensajes al servicio
    this.mensajesService.getListadoMensajes(this.tipoListadoMensajes, this.paginator.pageIndex, this.paginator.pageSize).subscribe(data => {
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
    // Utilizo el MatDialog para construir un diálogo que muestre un componente.
    // También le paso como datos, al diálogo, un objeto de tipo Mensaje
    const dialogRef = this.dialog.open(DetalleMensajeComponent, {
      width: '100%',
      height: '90%',
      data: mensaje,
    });

    // Me subscribo al evento de cierre del diálogo. Cuando se cierre actulizo el listado de mensajes
    dialogRef.afterClosed().subscribe(result => {
      this.actualizaListadoMensajes();
    });
  }



  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceTabla.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourceTabla.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Mensaje): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  /**
   *  Actualizar mensajes en función de la carpeta seleccionada
   * */ 
  cambioEnTiposDeMensajesVisualizados(indiceTiposDeMensajeSeleccionado) {
    this.paginator.firstPage(); // Reinicio el paginador
    // He puesto los tabs en orden para que el indice del tipo de mensajes coincida con el orden
    // de los tipos de mensajes que puede devolver el servidor
    // 0 -> Recibidos
    // 1 -> Enviados
    // 2 -> Spam
    // 3 -> Archivado
    this.tipoListadoMensajes = indiceTiposDeMensajeSeleccionado
    this.actualizaListadoMensajes();
  }  



  /**
   * Obtiene en un array todos los identificadores de mensajes seleccionados
   */
  getIdsMensajesSeleccionados (): number[] {
    var idsMensajesSeleccionados = [];
    this.selection.selected.forEach((item, index) => {
      idsMensajesSeleccionados.push(item.id);
    });
    return idsMensajesSeleccionados;
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
    this.mensajesService.accionSobreMensajes(this.getIdsMensajesSeleccionados(), tipoAccion).subscribe(strResult => {
      if (strResult['result'] == 'fail') {
        this.comunicacionAlertas.abrirDialogError('Error al realizar la operación. Inténtelo más tarde.')
      }
      else {
        this.actualizaListadoMensajes();
      }
    });
  }


  /**
   * En función del tipo de mensaje (recibidos, enviados, etc...) obtiene un texto diferente
   * para la columna del remitente del mensaje
   */
  getTextoColumnaRemitente (mensaje: Mensaje) {
    if (this.usuarioAutenticado.id != mensaje.remitente.id) {
      return 'De: ' + mensaje.remitente.nombre
    }
    else {
      var str: string = 'Para: ';
      mensaje.destinatarios.forEach(function(destinatario, i, destinatarios) {
        str += destinatario.nombre;
        if (i < (destinatarios.length-1)) {
          str += ', '; 
        }
      })
      return str;
    }
  }


    // Métodos para controlar cuando los botones están habilitados o deshabilitados
    hayAlgunElementoSeleccionadoEnTabla(): boolean {
      return this.selection.selected.length > 0;
    }
  
    botonArchivarHabilitado(): boolean {
      return this.tipoListadoMensajes == MensajeService.RECIBIDOS && this.hayAlgunElementoSeleccionadoEnTabla();
    }
  
    botonSpamHabilitado(): boolean {
      return this.tipoListadoMensajes == MensajeService.RECIBIDOS && this.hayAlgunElementoSeleccionadoEnTabla();
    }
  
    botonEliminarHabilitado(): boolean {
      return this.tipoListadoMensajes != MensajeService.ENVIADOS && this.hayAlgunElementoSeleccionadoEnTabla();
    }
  
    botonMoverARecibidosHabilitado(): boolean {
      return (this.tipoListadoMensajes == MensajeService.SPAM || this.tipoListadoMensajes == MensajeService.ARCHIVADOS) 
        && this.hayAlgunElementoSeleccionadoEnTabla();
    }
  

    /**
     * Se encarga de abrir el Diálogo de un nuevo mensaje, para redactarlo
     */
    nuevoMensaje() {
      const dialogRef = this.dialog.open(NuevoMensajeComponent, {
        width: '100%',
        height: '90%'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.actualizaListadoMensajes();
      });
      }
}
