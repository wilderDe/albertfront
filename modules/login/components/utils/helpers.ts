import axios from 'axios'
import { imprimir } from '../../../../common/utils/imprimir'

export const obtenerImagenItem = async (nombre: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/item/${nombre}`,
      {
        responseType: 'arraybuffer',
      }
    )
    const contentType = response.headers['content-type']
    const imageType = contentType.split('/')[1]
    const imageData = Buffer.from(response.data, 'binary').toString('base64')
    const imageUrl = `data:image/${imageType};base64,${imageData}`
    return imageUrl
  } catch (error) {
    imprimir('Error al hacer la solicitud:', error)
  }
}


export const obtenerImagenEvento = async (nombre: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/evento/${nombre}`,
        {
          responseType: 'arraybuffer',
        }
      )
      const contentType = response.headers['content-type']
      const imageType = contentType.split('/')[1]
      imprimir('Tipo de imagen:', imageType)
      const imageData = Buffer.from(response.data, 'binary').toString('base64')
      const imageUrl = `data:image/${imageType};base64,${imageData}`
      return imageUrl
    } catch (error) {
      imprimir('Error al hacer la solicitud:', error)
    }
  }