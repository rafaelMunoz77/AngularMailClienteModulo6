import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { AutenticadorJwtService } from '../../services/autenticador-jwt.service'; 

/**
 * Decorador que especifica a esta clase Typescript como un componente, con su selector
 * y su cara visible (html + estilos)
 */
@Component({
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.scss']
})

/**
 * Este componente se ocupa de permitir que podamos autenticar a un usuario
 */
export class LoginUsuarioComponent implements OnInit {

  // Propiedades de la clase
  loginForm: FormGroup; // Permite tener un objeto linkado a los campos del formulario de autenticación

  /**
   * Le pido al inyector de código que genere objetos de determinados tipos, útiles
   */
  constructor(private usuarioService: UsuarioService, private router: Router, private autenticadorJwtService: AutenticadorJwtService) { }

  /**
   * Hook al momento de inicialización del componente
   */
  ngOnInit(): void {
    // Inicializo el objeto FormGroup, es la base para usar formularios reactivos, en los que la validación
    // y el control son muy fáciles de realizar.
    this.loginForm = new FormGroup({
      usuario: new FormControl ('rafa', [Validators.required, Validators.minLength(4)]),
      password: new FormControl ('81dc9bdb52d04dc20036dbd8313ed055', [])
    });
  }

  /**
   * Método que autentica un usuario con los valores expuestos en el formulario del template
   */
  autenticaUsuario() {
    // Utilizo el "UsuarioService" para enviar los datos de logado y subscribirme a la respuesta del 
    // servidor
    this.usuarioService.autenticaUsuario(this.loginForm.controls.usuario.value,
      this.loginForm.controls.password.value).subscribe(data => {
        console.log(data);
        if (data.jwt != undefined) {
          this.autenticadorJwtService.almacenaJWT(data.jwt);
          this.router.navigate(['/listadoMensajes']);
        } 
        else {
          console.log('Datos incorrectos');
        }
      });
  }

}
