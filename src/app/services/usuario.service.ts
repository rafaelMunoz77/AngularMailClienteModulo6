import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }


  /**
   * 
   */
  autenticaUsuario (usuario: string, password: string) : Observable<object> {
    var jsonObject = {
      usuario: usuario,
      password: password
    };

    return this.http.post('http://localhost:8080/usuario/autentica', jsonObject);

  }
}
