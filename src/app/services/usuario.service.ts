import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatosConJwt } from '../interfaces/interfaces'


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }


  /**
   * 
   */
  autenticaUsuario (usuario: string, password: string) : Observable<DatosConJwt> {
    var jsonObject = {
      usuario: usuario,
      password: password
    };

    return this.http.post<DatosConJwt>('http://localhost:8080/usuario/autentica', jsonObject).pipe(
      tap(data => { 
        console.log('Desde tap miro los datos recibidos: ' + data["jwt"]);
      })
    ); 

  }
}
