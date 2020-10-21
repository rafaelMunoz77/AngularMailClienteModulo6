import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.scss']
})
export class LoginUsuarioComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  autenticaUsuario() {
    var jsonObject = {
      usuario: (<HTMLInputElement>document.getElementById("usuario")).value,  // Utilizo el id de los campos del formulario
      password: (<HTMLInputElement>document.getElementById("password")).value
    };

    console.log("u: " + jsonObject.usuario + " - p: " + jsonObject.password);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("respuestaDelServidor").innerHTML = this.response;
      }
    };
    xhttp.open("POST", "http://localhost:8080/usuario/autentica", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(jsonObject));
  }

}
