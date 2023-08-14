/// CRUD de evento

export interface ItemCRUDType {
  id?: string
  estado: string
  horaInicio: string
  horaFinal:string
  expositor: string
  tema: string
  detalles: string
  detallesTabla: string
  imagenItem: string
  evento: {
    estado: string
    transaccion: string
    usuarioCreacion: string
    fechaCreacion: string
    usuarioModificacion: string
    fechaModificacion: string
    id: string
    nombre: string
    fechaEvento: string
    ubicacion: string
    descripcion: string
    modalidad: string
  }
}

export interface CrearEditarItemCRUDType {
  id?: string
  estado?: string
  horaInicio: string
  horaFinal:string
  expositor: string
  tema: string
  detalles: string
  evento: string
  imagenItem?: FileList | null
}
