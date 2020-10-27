import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListadoMensajes, Usuario } from '../interfaces/interfaces';


// El decorador @Inyectable permite que el inyector de código cree una instancia de esta
// clase en el constructor de otras clases
@Injectable({
  providedIn: 'root'
})

/**
 * Esta clase aglutina todos los métodos relacionados con obtener mensajes, enviar mensajes,
 * cambiar el estado de los mensajes, etc.
 */
export class MensajeService {

  public static readonly RECIBIDOS = 0;
  public static readonly ENVIADOS = 1;
  public static readonly SPAM = 2;
  public static readonly ARCHIVADOS = 3;

  /**
   * En este constructor pido al inyector de código que cree variables
   * @param http    ->  para poder hacer peticiones asíncronas por protocolo http.
   */
  constructor(private http: HttpClient) { }

  /**
   * Pide una página (conjunto ordenador de mensajes) al servidor. La paginación es necesaria.
   */
  getListadoMensajes(tipo: number, pagina: number, lineasPorPagina: number): Observable<ListadoMensajes> {
    return this.http.get<ListadoMensajes>('/mensajes/listadoPorTipo?tipo=' + tipo + '&pagina=' + pagina + 
      '&mensajesPorPagina=' + lineasPorPagina).pipe(
//      tap(data => console.log(data)), // Si deseas hacer algo con los datos obtenidos, puedes hacerlo en esta línea
    );
  }


  /**
   * Envía un comando para realizar una acción sobre un mensaje. El tipo de acción tiene código
	 * 		0 -> marca como mensajes leídos
	 * 		1 -> marca como mensajes archivados
	 * 		2 -> marca como mensajes spam
	 * 		3 -> marca como mensajes eliminados
	 * 		4 -> mueve el mensaje a "recibidos", elimina las marcas de "leído", "archivado", "spam" y "eliminado"
   */
  accionSobreMensajes (ids: number[], tipoAccion: number) {
    var dto = {
      'ids': ids,
      'tipoAccion': tipoAccion
    };
    return this.http.post<string>('/mensajes/accionSobreMensajes', dto);
  }



  /**
   * Envia un nuevo mensaje
   */
  enviarNuevoMensaje (destinatarios: Usuario[], asunto: string, cuerpo: string) {
    var idsDestinatarios: number[] = []; // Construyo un array vacío de tipo number
    // Para cada usuario recibido, tomo su "id" y lo agrego al array
    destinatarios.forEach(usuario => idsDestinatarios.push(usuario.id)); 
    // Construyo un objeto para enviar al servidor
    var dto = {
      'idsDestinatarios': idsDestinatarios,
      'asunto': asunto,
      'cuerpo': cuerpo
    };
    // realizo la petición y devuelvo el Observable
    return this.http.put<string>('/mensajes/nuevo', dto);
  }

}
