// Sólo usada para recibir un objeto que contenga un campo llamado "jwt". Usado en la autenticación del usuario
export interface DatosConJwt {
    jwt: string;
}

// Datos de un listado de mensajes, en el que se incluyen el listado y la cantidad total
export interface ListadoMensajes {
    mensajes: Mensaje[];
    totalMensajes: number;
}

// Datos completos de un mensaje
export interface Mensaje {
    id: number;
    remitente: UsuarioMinimo,  // Sólo me interesa nombre e id
    destinatarios: UsuarioMinimo[], // Sólo nombre de usuario e id
    fecha: Date;
    asunto: string;
    cuerpo: string;
    leido: boolean;
    archivado: boolean;
    fechaEliminacion: Date;
    spam: boolean;
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

// Mínimos datos sobre un usuario
export interface UsuarioMinimo {
    id: number;
    nombre: string;
}

// Datos sobre una nacionalidad
export interface Nacionalidad {
    id: number;
    descripcion: string;
}

// Datos sobre un tipo de sexo
export interface TipoSexo {
    id: number;
    descripcion: string;
}
