// Una interface para definir el tipo de datos que puedo pasar a un dialogo
export interface DialogDataType {
    tipoDialogo: number,  // Será uno de los de "DialogTypes" un poco más abajo
    texto: string
}

// Clase con "constantes" que utilizaremos para especificar un tipo de diálogo o
// un botón pulsado dentro del mismo.
export class DialogTypes {
    public static readonly ESPERANDO = 1;
    public static readonly ERROR = 2;
    public static readonly CONFIRMACION = 3;
    public static readonly INFORMACION = 4;

    public static readonly RESPUESTA_CANCELAR = 0;
    public static readonly RESPUESTA_ACEPTAR = 1;
}