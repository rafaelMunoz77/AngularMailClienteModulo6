import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ComunicacionDeAlertasService } from '../../services/comunicacion-de-alertas.service';
import { Nacionalidad, TipoSexo, Usuario } from '../../interfaces/interfaces';
import { NacionalidadService } from '../../services/nacionalidad.service';
import { TipoSexoService } from '../../services/tipo-sexo.service';


@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html',
  styleUrls: ['./datos-usuario.component.scss']
})
/**
 * Componente que muestra todos los datos del usuario autenticado y permite modificarlos
 */
export class DatosUsuarioComponent implements OnInit {
  form: FormGroup; // Objeto que permite tomar el control sobre los campos del formulario, por un formulario reactivo
  usuario: Usuario = null; // Utilizo un objeto de tipo Usuario, para cargar los valores del usuario autenticado y para recoger los valores de los campos del formulario
  nacionalidades: Nacionalidad[]; // Voy a mostrar un desplegable con las nacionalidades, para elegir una, los guardo en un array
  tiposSexo: TipoSexo[]; // Voy a mostrar un desplegable con los tipos de sexo, debo guardarlos en un array


  /**
   * Constructor con los objetos que necesito por parte del inyector
   */
  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private nacionalidadService: NacionalidadService,
    private tipoSexoService: TipoSexoService) {
  }

  /**
   * Hook que me permitirá indicar lo que hacer al inicializar el componente
   */
  ngOnInit() {
    this.cargarNacionalidades(); // Obtengo y cargo las nacionalidades
    this.cargarTiposSexo(); // Obtengo y cargo los tipos de sexo
    
    this.cargarDatosUsuarioAutenticado(); // Intento obtener los datos del usuario autenticado

    // Inicializo el formulario reactivo. Recuerda que cada campo del FormGroup corresponde con un elemento del formulario en el fichero html
    this.form = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      nombre: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      nacionalidad: new FormControl('', []),
      sexo: new FormControl('', []),
    });
  }

  // Este método llama al servicio de usuarios, le pide obtener el usuario autenticado y pone sus datos en pantalla.
  cargarDatosUsuarioAutenticado() {
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuario => {
      // Cuando obtengo los datos, los muestro en los controles del formulario.
      this.usuario = usuario; 
      this.form.controls.usuario.setValue(this.usuario.usuario);
      this.form.controls.email.setValue(this.usuario.email);
      this.form.controls.nombre.setValue(this.usuario.nombre);
      // La fecha es algo particular, ya que el servidor envía la fecha en formato milisegundos, se debe transformar a un objeto Date.
      this.form.controls.fechaNacimiento.setValue(new Date(this.usuario.fechaNacimiento));
      this.form.controls.nacionalidad.setValue(this.usuario.nacionalidad); // establezco valores en los desplegables de nacionalidad y sexo
      this.form.controls.sexo.setValue(this.usuario.sexo);
    });
  }

  /**
   * Pide al servicio de nacionalidades que obtenga todas las posibles y la carga en el array this.nacionalidades
   */
  cargarNacionalidades() {
    this.nacionalidades = [];
    this.nacionalidadService.getListadoNacionalidades().subscribe(nacionalidades => nacionalidades.forEach(nacionalidad =>
      // La siguiente línea se ejecuta para cada objeto recibido de tipo Nacionalidad
      this.nacionalidades.push(nacionalidad)));
  }


  /**
   * Pide al servicio de tipos de sexo que obtenga todos los posibles y los carga en el array this.tiposSexo
   */
  cargarTiposSexo() {
    this.tiposSexo = [];
    this.tipoSexoService.getListadoTiposSexo().subscribe(tiposSexo => tiposSexo.forEach(tipo =>
      // La siguiente línea se ejecuta para cada objeto recibido de tipo TipoSexo
      this.tiposSexo.push(tipo)));
  }

  /**
   * Este método se ejecuta cuando el usuario selecciona un fichero de imagen. Lee dicho fichero y serializa su
   * contenido, es decir, obtiene una cadena de texto en la que se encuentra todo el contenido del fichero. Dicho
   * contenido, para que pueda viajar por http se codifica en base64. En el servidor se deberá decodificar el fichero
   * para volverlo a convertir en binario. Normalmente para el binario usamos un tipo de array de bytes   "byte[]"
   */
  usuarioSeleccionaFicheroImagen() {
    const inputNode: any = document.querySelector('#file'); // Obtengo el control etiquetado en Angular como #file

    if (typeof (FileReader) !== 'undefined') { // tomo una precaución para comprobar que puedo utilizar el tipo FileReader
      const reader = new FileReader(); // Instancio un FileReader()

      // Pido al objeto reader que lea el primer (y único) fichero seleccionado por el control etiquetado como #file.
      // esta acción no es inmediata, es asíncrona, ya que no sabemos el tiempo que un lector de ficheros tardará en leer
      // fichero. Todo depende del tamaño del archivo.
      // Cuando el lector termine se disparará su evento "onload()", que se encuentra en este fichero, línea 112.
      reader.readAsArrayBuffer(inputNode.files[0]);

      // Cuando el objeto reader termina de leer el fichero seleccionado por el usuario, dispara su evento "onload()"
      reader.onload = (e: any) => {
        // transformo el contenido del fichero leído, en la variable "e" a una cadena de texto codificada en Base64.
        // Además lo cargo en el campo this.usuario.imagen. Esto provocará que la imagen del html cambie, ya que dicha
        // imagen muestra, en todo momento, el valor de this.usuario.imagen
        this.usuario.imagen = btoa(
          new Uint8Array(e.target.result)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      };
    }
  }

  /**
   * Para actualizar los datos del formulario en el usuario del servidor:
   * 1.- Leo los datos del formulario, asignándolos a los valores del this.usuario.
   * 2.- Utilizo el this.usuario para enviarlo al servicio de los usuarios, que lo enviará por http al servidor
   */
  actualizarDatos() {
    this.comunicacionAlertas.abrirDialogCargando(); // Planto la pantalla de carga

    // Leo los valores de los controles del formulario y los introduzco en this.usuario
    this.usuario.usuario = this.form.controls.usuario.value;
    this.usuario.email = this.form.controls.email.value;
    this.usuario.nombre = this.form.controls.nombre.value;
    this.usuario.fechaNacimiento = this.form.controls.fechaNacimiento.value.getTime();
    this.usuario.nacionalidad = this.form.controls.nacionalidad.value;
    this.usuario.sexo = this.form.controls.sexo.value;

    // Envío los valores de this.usuario al usuarioService y espero la respuesta del servidor.
    this.usuarioService.actualizaDatosUsuario(this.usuario).subscribe(resultado => {
      if (resultado["result"] == "fail") { // Ha ocurrido algún fallo en el servidor
        this.comunicacionAlertas.abrirDialogError('Error al actualizar los datos del usuario. Inténtelo más tarde.')
      }
      else { // Todo ha ido correctamente, muestro un mensaje en pantalla para informar, me subscribo al evento de
        // cierre del mensaje y después redirijo al listado de mensajes.
        this.comunicacionAlertas.abrirDialogInfo('Usuario actualizado').subscribe(result => {
          this.router.navigate(['/listadoMensajes']);
        });
      }
    })
  }

  /**
   * No hago nada y vuelvo al listado de mensajes
   */
  cancelar() {
    this.router.navigate(['/listadoMensajes']);
  }
}