import { NextPage } from 'next'
import { LayoutUser } from '../../../common/components/layouts'
import { useEffect, useState } from 'react'
import { useFullScreenLoading } from '../../../context/ui'
import { InterpreteMensajes, delay } from '../../../common/utils'
import { Servicios } from '../../../common/services'
import { Constantes } from '../../../config'
import {
  obtenerImagenEvento,
  obtenerImagenItem,
} from '../../login/components/utils/helpers'
import { EventoResponse } from '../../login/types/evento'
import { imprimir } from '../../../common/utils/imprimir'
import { useAlerts } from '../../../common/hooks'
import { Box } from '@mui/material'
import HeroHome from './HeroHome'
import PortadaHome from './PortadaHome'
import TarjetasHome from './TarjetasHome'

const User: NextPage = () => {
  const { Alerta } = useAlerts()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const [eventos, setEventos] = useState<EventoResponse[]>([])

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
    obtenerEventos()
  }, [])
  return (
    <LayoutUser>
      <HeroHome />
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
              <PortadaHome evento={evento} />
              <Box
                sx={{
                  marginTop: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                }}
              >
                {evento.items.map((item, itemIndex) => (
                  <TarjetasHome key={itemIndex} item={item} />
                ))}
              </Box>
            </Box>
          ))}
    </LayoutUser>
  )
}

export default User
