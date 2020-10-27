import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ComunicacionDeAlertasService } from '../../services/comunicacion-de-alertas.service';
import { Usuario } from '../../interfaces/interfaces';
import { MensajeService } from '../../services/mensaje.service';
import { UsuarioService } from '../../services/usuario.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { debounceTime} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nuevo-mensaje',
  templateUrl: './nuevo-mensaje.component.html',
  styleUrls: ['./nuevo-mensaje.component.scss']
})
export class NuevoMensajeComponent implements OnInit {
  usuarioAutenticado: Usuario = null; // Necesito obtener el usuario autenticado
  form: FormGroup; // Para el formulario reactivo
  separatorKeysCodes: number[] = [ENTER, COMMA]; // Pulsaciones del teclado que confirman la selección de un destinatario
  destinatariosFiltrados: Observable<Usuario[]>; // Observable para rellenar los usuarios filtrados de la búsqueda
  destinatariosSeleccionados: Usuario[] = []; // Array con los usuario seleccionados
  // Necesito tener acceso al input en el que se amontonan los destinatarios seleccionados
  @ViewChild('DestinatariosInput') destinatariosInput: ElementRef<HTMLInputElement>;

  /**
   * Constructor
   */
  constructor(private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<NuevoMensajeComponent>,
    private mensajeService: MensajeService,
    private snackBar: MatSnackBar,
    private comunicacionAlertas : ComunicacionDeAlertasService) {

  }

  /**
   * En la inicialización obtengo el usuario autenticado e inicializo el formulario reactivo
   */
  ngOnInit(): void {
    this.usuarioService.getUsuarioAutenticado().subscribe(usuario =>
      this.usuarioAutenticado = usuario);

    this.form = new FormGroup({
      destinatarios: new FormControl('', []),
      asunto: new FormControl('', [Validators.required]),
      cuerpo: new FormControl('', [Validators.required])
    });

    // Establezco que el "input" "destinatarios", cuando se reciba una pulsación de teclado "valueChanges",
    // realizará una serie de acciones en tubería (pipe): primero espera 300 milisegundos; en segundo lugar
    // se subscribe a la llamada del método usado para filtrar usuarios.
    this.form.controls.destinatarios.valueChanges.pipe(
      debounceTime(300)).subscribe(filtro => {
        if (typeof filtro === 'string') {
          // Al ser de tipo Observable, la siguiente variable cargará los usuarios filtrados, cuando estos lleguen desde el servidor
          this.destinatariosFiltrados = this.usuarioService.filterUsuariosByNombreOrEmail(filtro);
        }
      });
  }

  /**
   * Cerrar este diálogo
   */
  volver() {
    this.dialogRef.close();
  }

  /**
   * Para enviar el mensaje, primero hacemos unas comprobaciones
   */
  enviar() {
    if (this.destinatariosSeleccionados.length == 0) { // Compruebo destinatarios
      this.comunicacionAlertas.mostrarSnackBar('No ha seleccionado ningún destinatario');
      return;
    }
    if (!this.form.controls.asunto.valid) { // Compruebo asunto
      this.comunicacionAlertas.mostrarSnackBar('No ha escrito un asunto');
      return;
    }
    if (!this.form.controls.cuerpo.valid) { // Compruebo cuerpo
      this.comunicacionAlertas.mostrarSnackBar('No ha escrito un mensaje');
      return;
    }

    // Envio los datos para el mensaje
    this.mensajeService.enviarNuevoMensaje(this.destinatariosSeleccionados, this.form.controls.asunto.value,
      this.form.controls.cuerpo.value).subscribe(resultado => {
      if (resultado == null) {
        this.comunicacionAlertas.mostrarSnackBar('Error al enviar el mensaje. Inténtelo más tarde.')
      }
      else {
        this.comunicacionAlertas.mostrarSnackBar('Mensaje enviado')
        this.volver();
      }
     })

  }

  /**
   * Método necesario para eliminar un usuario destinatario de la lista de destinatarios
   */
  remove(destinatario: Usuario): void {
    const index = this.destinatariosSeleccionados.indexOf(destinatario);

    if (index >= 0) {
      this.destinatariosSeleccionados.splice(index, 1);
    }
  }

  /**
   * Este método selecciona un nuevo destinatario, lo agrega a la lista de los seleccionados y
   * limpia el "input" en el que se ha escrito para filtrar usuarios
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    this.destinatariosSeleccionados.push(event.option.value);
    this.destinatariosInput.nativeElement.value = '';
  }
}
