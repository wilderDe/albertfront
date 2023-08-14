/// CRUD de categoria

export interface CategoriaCRUDType {
  id: string
  nombre: string
  descripcion: string
  estado: string
}

export interface CrearEditarCategoriaCRUDType {
  id?: string
  nombre: string
  descripcion: string
}
