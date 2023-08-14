import dayjs from 'dayjs'
import 'dayjs/locale/es'

const MAX_DESC_LENGTH = 150

export const recortarTexto = (texto: string) => {
  const descripcion = texto // Tu descripción completa

  let descripcionRecortada = descripcion

  if (descripcion.length > MAX_DESC_LENGTH) {
    descripcionRecortada = `${descripcion.substring(0, MAX_DESC_LENGTH)}...`
  }
  return descripcionRecortada
}

export const formatearFecha = (fecha: string) => {
  const fechaParsed = dayjs(fecha)
  dayjs.locale('es')
  const formato = fechaParsed.format('D [de] MMMM [del] YYYY')
  return formato
}
