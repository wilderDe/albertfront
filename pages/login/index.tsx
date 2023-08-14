import type { NextPage } from 'next'
import { LayoutLogin } from '../../common/components/layouts'
import { Box } from '@mui/material'
import { delay, InterpreteMensajes, siteName } from '../../common/utils'
import { Constantes } from '../../config'
import { Servicios } from '../../common/services'
import { useFullScreenLoading } from '../../context/ui'
import { useEffect, useState } from 'react'
import { useAlerts } from '../../common/hooks'
import { imprimir } from '../../common/utils/imprimir'
import Hero from '../../modules/login/components/Hero'
import { EventoResponse } from '../../modules/login/types/evento'
import Portada from '../../modules/login/components/Portada'
import Tarjetas from '../../modules/login/components/Tarjetas'
import {
  obtenerImagenEvento,
  obtenerImagenItem,
} from '../../modules/login/components/utils/helpers'

const Index: NextPage = () => {
  const { Alerta } = useAlerts()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const [eventos, setEventos] = useState<EventoResponse[]>([])
  const obtenerEstado = async () => {
    try {
      mostrarFullScreen()
      await delay(1000)
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl}/estado`,
        body: {},
        headers: {
          accept: 'application/json',
        },
      })
      imprimir(`Se obtuvo el estado 🙌`, respuesta)
    } catch (e) {
      imprimir(`Error al obtener estado`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      ocultarFullScreen()
    }
  }

  const obtenerEventos = async () => {
    try {
      mostrarFullScreen()
      await delay(1000)
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl}/evento`,
        body: {},
        headers: {
          accept: 'application/json',
        },
      })
      for (const i of respuesta.datos.filas) {
        const base64 = await obtenerImagenEvento(i.imagenEvento)
        i.imagenEvento = base64
        for (const j of i.items) {
          const base64Item = await obtenerImagenItem(j.imagenItem)
          j.imagenItem = base64Item
        }
      }
      setEventos(respuesta.datos?.filas)
      imprimir(`Se obtuvo los eventos🙌`, respuesta.datos.filas)
    } catch (e) {
      imprimir(`Error al obtener estado`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      ocultarFullScreen()
    }
  }
  useEffect(() => {
    obtenerEstado().then(() => {})
    obtenerEventos()
  }, [])

  //TODO: Crearse un Layout personalizado
  //TODO: Categorizar los eventos
  //TODO: Mostrar primeros 5 mas resientes
  //TODO: Los mas vistos
  //TODO: Footer
  //Animaciones
  //TODO: Responsive desing
  //Cambiar los tonos de colores

  return (
    <LayoutLogin title={siteName()}>
      <Hero />
      {eventos?.length === 0
        ? 'No se obtuvo los eventos'
        : eventos.map((evento, indexEvento) => (
            <Box
              key={indexEvento}
              sx={{
                width: '80%',
                margin: '0 auto',
                marginBottom: 5,
              }}
            >
              <Portada evento={evento} />
              <Box
                sx={{
                  marginTop: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                }}
              >
                {evento.items.map((item, itemIndex) => (
                  <Tarjetas key={itemIndex} item={item} />
                ))}
              </Box>
            </Box>
          ))}
    </LayoutLogin>
  )
}

export default Index
