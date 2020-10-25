// Sólo usada para recibir un objeto que contenga un campo llamado "jwt". Usado en la autenticación del usuario
export interface DatosConJwt {
    jwt: string;
} 

// Estructura de un mensaje
export interface Mensaje {
    id: number;
    asunto: string;
    cuerpo: string;
    fecha: Date;
}

// Datos de un usuario
export interface Usuario {
    id: number;
    nombre: string;
    usuario: string;
    password: string;
    email: string;
    fechaNacimiento: Date;
    fechaEliminacion: Date;
    nacionalidad: number;
    sexo: number;
    imagen: string;
  }