/// CRUD de evento

export interface EventoCRUDType {
  id: string
  nombre: string
  fechaEvento: string
  ubicacion: string
  descripcion: string
  descripcionTabla: string
  modalidad: string
  imagenEvento: string
  categoria: {
    estado: string
    transaccion?: string
    usuarioCreacion?: string
    fechaCreacion: string
    usuarioModificacion?: string
    fechaModificacion: string
    id: string
    nombre: string
    descripcion: string
  }
  estado: string
  items?: Array<string>
  participantes?: Array<string>
}

export interface CrearEditarEventoCRUDType {
  id?: string
  nombre: string
  fechaEvento: string
  ubicacion: string
  descripcion: string
  modalidad: string
  categoria: string
  imagenEvento?: FileList | null
}
