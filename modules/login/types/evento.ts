export interface Categoria {
  estado: string
  transaccion: string
  usuarioCreacion: string
  fechaCreacion: string
  usuarioModificacion: string | null
  fechaModificacion: string
  id: string
  nombre: string
  descripcion: string
}

export interface Item {
  estado: string
  transaccion: string
  usuarioCreacion: string
  fechaCreacion: string
  usuarioModificacion: string | null
  fechaModificacion: string
  id: string
  horaInicio: string
  horaFinal: string
  expositor: string
  tema: string
  detalles: string
  imagenItem: string
}

export interface EventoResponse {
  estado: string
  id: string
  nombre: string
  fechaEvento: string
  ubicacion: string
  descripcion: string
  modalidad: string
  imagenEvento: string
  categoria: Categoria
  items: Item[]
  participantes: any[] // Cambia "any" si tienes una estructura específica para los participantes
}
