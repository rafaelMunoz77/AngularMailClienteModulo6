import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DatosConJwt } from '../interfaces/interfaces'
import { Md5 } from 'ts-md5/dist/md5'; // Para codificar en MD5
import { Usuario } from '../interfaces/interfaces';

/**
 * El decorador @Inyectable permite que esta clase se instancie por el inyector de código
 */
@Injectable({
  providedIn: 'root'
})

/**
 * Esta clase permitirá autenticar y modificar datos del usuario
 */
export class UsuarioService {

  usuarioAutenticado: Usuario; // Para almacenar el usuario autenticado
  @Output()  
  cambiosEnUsuarioAutenticado = new EventEmitter<Usuario>(); // Evento cuando el usuario autenticado
  // ha cambiado

  // Constructor con objetos que deben crearse por parte del inyector de código.
  constructor(private http: HttpClient) { }


  /**
   * Método para autenticar al usuario, recibiendo su nombre y su contraseña.
   */
  autenticaUsuario (usuario: string, password: string) : Observable<DatosConJwt> {
    const md5 = new Md5(); // Creo un objeto que permite codificar en MD5
    var jsonObject = {
      usuario: usuario,
      password: md5.appendStr(password).end().toString()  // Codifico en MD5 el password recibido
    };

    // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
    return this.http.post<DatosConJwt>('/usuario/autentica', jsonObject).pipe(
      tap(data => { 
//        console.log('Desde tap miro los datos recibidos: ' + data["jwt"]);
      })
    ); 

  }



  /**
   * Permite obtener un usuario autenticado en el servidor.
   */
  getUsuarioAutenticado(incluirImagen: boolean = false): Observable<Usuario> {
    // Petición para obtener el usuario autenticado, funcionará porque se envía el JWT en 
    // cada petición, gracias al HttpInterceptor
    return this.http.get<Usuario>('/usuario/getAutenticado?imagen=' + incluirImagen)
    .pipe(
      tap(usuarioAutenticado => {
        // En la condición del if intento detectar varios casos que provocan un cambio en 
        // el usuario autenticado
        if ( (this.usuarioAutenticado == null && usuarioAutenticado != null) || // No había usuario autenticado y ahora sí lo hay - Autenticación
          (this.usuarioAutenticado != null && usuarioAutenticado == null) ||  // Había usuario autenticado y ya no lo hay - Cierre de sesión
          (this.usuarioAutenticado != null && usuarioAutenticado == null && this.usuarioAutenticado.id != usuarioAutenticado.id) ) { // Cambio de usuario autenticado
            this.emitirNuevoCambioEnUsuarioAutenticado();
            this.usuarioAutenticado = usuarioAutenticado;
          }
      })
    );
  }


  /**
   * Es un método que podrá llamarse para permitir que cualquiera, que esté subscrito a 
   * this.cambiosEnUsuarioAutenticado, sepa que el usuario autenticado ha cambiado.
   */
  emitirNuevoCambioEnUsuarioAutenticado () {
    this.getUsuarioAutenticado(true).subscribe(usuarioAutenticado => {
      this.cambiosEnUsuarioAutenticado.emit(usuarioAutenticado);
    });
  }


}
