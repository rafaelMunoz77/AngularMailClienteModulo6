import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatosConJwt } from '../interfaces/interfaces'
import { Md5 } from 'ts-md5/dist/md5'; // Para codificar en MD5

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
        console.log('Desde tap miro los datos recibidos: ' + data["jwt"]);
      })
    ); 

  }
}
