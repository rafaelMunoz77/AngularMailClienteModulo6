import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


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

  /**
   * En este constructor pido al inyector de código que cree variables
   * @param http    ->  para poder hacer peticiones asíncronas por protocolo http.
   */
  constructor(private http: HttpClient) { }

  /**
   * Pide una página (conjunto ordenador de mensajes) al servidor. La paginación es necesaria.
   */
  getListadoMensajes(pagina: number, lineasPorPagina: number): Observable<object> {
    return this.http.get<object>('/mensajes/recibidos?pagina=' + pagina + 
      '&mensajesPorPagina=' + lineasPorPagina).pipe(
//      tap(data => console.log(data)), // Si deseas hacer algo con los datos obtenidos, puedes hacerlo en esta línea
    );
  }

}
