import type { NextPage } from 'next'
import {
  Avatar,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useAuth } from '../../context/auth'
import { LayoutUser } from '../../common/components/layouts'
import React, { ReactNode, useEffect, useState } from 'react'
import { CasbinTypes } from '../../common/types'
import {
  AlertDialog,
  CustomDataTable,
  CustomDialog,
  IconoTooltip,
} from '../../common/components/ui'
import {
  delay,
  InterpreteMensajes,
  siteName,
  titleCase,
} from '../../common/utils'
import { Constantes } from '../../config'
import { Paginacion } from '../../common/components/ui/datatable/Paginacion'
import { useRouter } from 'next/router'
import { useAlerts, useSession } from '../../common/hooks'
import { imprimir } from '../../common/utils/imprimir'
import { BotonBuscar } from '../../common/components/ui/botones/BotonBuscar'
import CustomMensajeEstado from '../../common/components/ui/estados/CustomMensajeEstado'
import { CriterioOrdenType } from '../../common/types/ordenTypes'
import { ordenFiltrado } from '../../common/utils/orden'
import { BotonOrdenar } from '../../common/components/ui/botones/BotonOrdenar'
import { IconoBoton } from '../../common/components/ui/botones/IconoBoton'
import { EventoCRUDType } from '../../modules/admin/eventos/types/evento/eventoCRUDTypes'
import { ModalEvento } from '../../modules/admin/eventos/ui/evento/ModalEvento'
import { FiltroEvento } from '../../modules/admin/eventos/ui/evento/FiltroEvento'
import axios from 'axios'
import ModalEnviarEmail from '../../modules/admin/eventos/ui/evento/ModalEnviarEmail'
import { formatearFecha } from '../../modules/admin/eventos/utils/helpers'

const Evento: NextPage = () => {
  const [eventosData, setEventosData] = useState<EventoCRUDType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const [errorEventoData, setErrorEventoData] = useState<any>()

  const [modalEvento, setModalEvento] = useState(false)
  const [modalEnviarEmail, setModalEnviarEmail] = useState(false)
  const [eventoEmail, setEventoEmail] = useState('')

  /// Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoEvento, setMostrarAlertaEstadoEvento] =
    useState(false)

  const [eventoEdicion, setEventoEdicion] = useState<
    EventoCRUDType | undefined | null
  >()

  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const { sesionPeticion } = useSession()
  const { estaAutenticado, permisoUsuario } = useAuth()

  const [filtroEvento, setFiltroEvento] = useState<string>('')
  const [mostrarFiltroEventos, setMostrarFiltroEventos] = useState(false)
  // Permisos para acciones
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  /// Método que muestra alerta de cambio de estado

  const editarEstadoEventoModal = async (evento: EventoCRUDType) => {
    setEventoEdicion(evento) // para mostrar datos de modal en la alerta
    setMostrarAlertaEstadoEvento(true) // para mostrar alerta de parametro
  }

  const cancelarAlertaEstadoEvento = async () => {
    setMostrarAlertaEstadoEvento(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setEventoEdicion(null)
  }

  /// Método que oculta la alerta de cambio de estado y procede
  const aceptarAlertaEstadoEvento = async () => {
    setMostrarAlertaEstadoEvento(false)
    if (eventoEdicion) {
      await cambiarEstadoEventoPeticion(eventoEdicion)
    }
    setEventoEdicion(null)
  }

  const cerrarModalEnviarEmail = () => {
    setModalEnviarEmail(false)
  }
  const abrirModalEnviarEmail = (id: string) => {
    setEventoEmail(id)
    setModalEnviarEmail(true)
  }

  /// Petición que cambia el estado de un parámetro
  const cambiarEstadoEventoPeticion = async (evento: EventoCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/evento/${evento.id}/${
          evento.estado == 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        tipo: 'patch',
      })
      imprimir(`respuesta estado evento: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerEventosPeticion()
    } catch (e) {
      imprimir(`Error estado eventos`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  //Funciona para obtener las imagenes
  const obtener = async (nombre: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/evento/${nombre}`,
        {
          responseType: 'arraybuffer', // Esto asegura que la respuesta se maneje como un ArrayBuffer
        }
      )

      // Verifica el tipo de contenido de la respuesta
      const contentType = response.headers['content-type']

      // Extrae el tipo de imagen desde el encabezado 'Content-Type'
      const imageType = contentType.split('/')[1]

      imprimir('Tipo de imagen:', imageType)

      // Ahora puedes hacer más cosas con la imagen, como mostrarla en una etiqueta <img> si es necesario
      const imageData = Buffer.from(response.data, 'binary').toString('base64')
      const imageUrl = `data:image/${imageType};base64,${imageData}`
      // Aquí puedes usar 'imageUrl' para mostrar la imagen en una etiqueta <img>
      return imageUrl
    } catch (error) {
      imprimir('Error al hacer la solicitud:', error)
    }
  }

  // router para conocer la ruta actual
  const router = useRouter()

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'id', nombre: 'Id Evento', ordenar: false },
    { campo: 'fechaEvento', nombre: 'Fecha del Evento', ordenar: true },
    { campo: 'items', nombre: 'Items', ordenar: false },
    { campo: 'participantes', nombre: 'Participantes', ordenar: false },
    { campo: 'nombre', nombre: 'Nombre', ordenar: false },
    { campo: 'ubicacion', nombre: 'Ubicación', ordenar: false },
    { campo: 'descripcion', nombre: 'Descripción', ordenar: false },
    { campo: 'modalidad', nombre: 'Modalidad', ordenar: false },
    { campo: 'categoria', nombre: 'Categoria', ordenar: false },
    { campo: 'imagen', nombre: 'Imagen', ordenar: false },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = eventosData.map(
    (eventoData, indexEvento) => [
      <Typography key={`${eventoData.id}-${indexEvento}-id`} variant={'body2'}>
        {`${eventoData.id}`}
      </Typography>,
      <Typography
        key={`${eventoData.fechaEvento}-${indexEvento}-fechaEvento`}
        variant={'body2'}
      >
        {`${formatearFecha(eventoData.fechaEvento)}`}
      </Typography>,
      <Typography
        key={`${eventoData.id}-${indexEvento}-items`}
        variant={'body2'}
      >
        {`${eventoData.items?.length}`}
      </Typography>,
      <Typography
        key={`${eventoData.id}-${indexEvento}-participantes`}
        variant={'body2'}
      >
        {`${eventoData.participantes?.length}`}
      </Typography>,
      <Typography
        key={`${eventoData.id}-${indexEvento}-nombre`}
        variant={'body2'}
      >
        {`${eventoData.nombre}`}
      </Typography>,
      <Typography
        key={`${eventoData.ubicacion}-${indexEvento}-ubicacion`}
        variant={'body2'}
      >
        {`${eventoData.ubicacion}`}
      </Typography>,
      <Typography
        key={`${eventoData.descripcion}-${indexEvento}-descripcion`}
        variant={'body2'}
      >
        {eventoData.descripcionTabla.length > 50
          ? `${eventoData.descripcionTabla.substring(0, 50)}...`
          : eventoData.descripcionTabla}
      </Typography>,
      <Typography
        key={`${eventoData.modalidad}-${indexEvento}-modalidad`}
        variant={'body2'}
      >{`${eventoData.modalidad}`}</Typography>,
      <Typography
        key={`${eventoData.categoria}-${indexEvento}-categoria`}
        variant={'body2'}
      >{`${eventoData.categoria.nombre}`}</Typography>,
      <Avatar
        sx={{
          height: 100,
          width: 100,
        }}
        key={`${eventoData.imagenEvento}-${indexEvento}-imagen`}
        src={eventoData.imagenEvento}
      />,
      <CustomMensajeEstado
        key={`${eventoData.id}-${indexEvento}-estado`}
        titulo={eventoData.estado}
        descripcion={eventoData.estado}
        color={
          eventoData.estado == 'ACTIVO'
            ? 'success'
            : eventoData.estado == 'INACTIVO'
            ? 'error'
            : 'info'
        }
      />,

      <Grid key={`${eventoData.id}-${indexEvento}-acciones`}>
        {permisos.update && (
          <IconoTooltip
            id={`cambiarEstadoEvento-${eventoData.id}`}
            titulo={eventoData.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
            color={eventoData.estado == 'ACTIVO' ? 'success' : 'error'}
            accion={async () => {
              await editarEstadoEventoModal(eventoData)
            }}
            desactivado={eventoData.estado == 'PENDIENTE'}
            icono={eventoData.estado == 'ACTIVO' ? 'toggle_on' : 'toggle_off'}
            name={
              eventoData.estado == 'ACTIVO'
                ? 'Inactivar Evento'
                : 'Activar Evento'
            }
          />
        )}

        {permisos.update && (
          <IconoTooltip
            id={`editarEvento-${eventoData.id}`}
            name={'Eventos'}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, eventoData)
              editarEventoModal(eventoData)
            }}
            icono={'edit'}
          />
        )}

        {permisos.update && (
          <IconoTooltip
            id={`enviarEmail-${eventoData.id}`}
            name={'Email'}
            titulo={'Enviar email'}
            color={'primary'}
            accion={() => {
              abrirModalEnviarEmail(eventoData.id)
            }}
            icono={'email'}
          />
        )}
      </Grid>,
    ]
  )
  const acciones: Array<ReactNode> = [
    <BotonBuscar
      id={'accionFiltrarEventosToggle'}
      key={'accionFiltrarEventosToggle'}
      seleccionado={mostrarFiltroEventos}
      cambiar={setMostrarFiltroEventos}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarEventos'}
        key={`ordenarEventos`}
        label={'Ordenar eventos'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={'actualizarEventos'}
      titulo={'Actualizar'}
      key={`accionActualizarEventos`}
      accion={async () => {
        await obtenerEventosPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de eventos'}
    />,
    permisos.create && (
      <IconoBoton
        id={'agregarEvento'}
        key={'agregarEvento'}
        texto={'Agregar'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar evento'}
        accion={() => {
          agregarEventoModal()
        }}
      />
    ),
  ]

  const obtenerEventosPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/evento`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroEvento.length == 0 ? {} : { filtro: filtroEvento }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
                orden: ordenFiltrado(ordenCriterios).join(','),
              }),
        },
      })
      for (const i of respuesta.datos.filas) {
        //console.log(i)
        const base64 = await obtener(i.imagenEvento)
        i.imagenEvento = base64
        i.descripcionTabla = i.descripcion.replace(/<[^>]+>/g, '')
      }
      setEventosData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorEventoData(null)
    } catch (e) {
      imprimir(`Error al obtener los eventos`, e)
      setErrorEventoData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const agregarEventoModal = () => {
    setEventoEdicion(undefined)
    setModalEvento(true)
  }
  const editarEventoModal = (evento: EventoCRUDType) => {
    setEventoEdicion(evento)
    setModalEvento(true)
  }

  const cerrarModalEvento = async () => {
    setModalEvento(false)
    await delay(500)
    setEventoEdicion(undefined)
  }

  async function definirPermisos() {
    setPermisos(await permisoUsuario(router.pathname))
  }

  useEffect(() => {
    definirPermisos().finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estaAutenticado])

  useEffect(() => {
    if (estaAutenticado) obtenerEventosPeticion().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    estaAutenticado,
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroEvento,
  ])

  useEffect(() => {
    if (!mostrarFiltroEventos) {
      setFiltroEvento('')
    }
  }, [mostrarFiltroEventos])

  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  )

  return (
    <>
      <AlertDialog
        isOpen={mostrarAlertaEstadoEvento}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          eventoEdicion?.estado == 'ACTIVO' ? 'inactivar' : 'activar'
        } el parámetro: ${titleCase(eventoEdicion?.nombre ?? '')} ?`}
      >
        <Button onClick={cancelarAlertaEstadoEvento}>Cancelar</Button>
        <Button onClick={aceptarAlertaEstadoEvento}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalEvento}
        handleClose={cerrarModalEvento}
        title={eventoEdicion ? 'Editar evento' : 'Nuevo evento'}
      >
        <ModalEvento
          evento={eventoEdicion}
          accionCorrecta={() => {
            cerrarModalEvento().finally()
            obtenerEventosPeticion().finally()
          }}
          accionCancelar={cerrarModalEvento}
        />
      </CustomDialog>
      <CustomDialog
        title="¿Enviar email de recordatorio a todos los participantes?"
        isOpen={modalEnviarEmail}
        handleClose={cerrarModalEnviarEmail}
      >
        <ModalEnviarEmail
          idEvento={eventoEmail}
          accionCancelar={cerrarModalEnviarEmail}
          accionCorrecta={() => {
            cerrarModalEnviarEmail()
          }}
        />
      </CustomDialog>
      <LayoutUser title={`Eventos - ${siteName()}`}>
        {
          <CustomDataTable
            titulo={'Eventos'}
            error={!!errorEventoData}
            cargando={loading}
            acciones={acciones}
            columnas={ordenCriterios}
            cambioOrdenCriterios={setOrdenCriterios}
            paginacion={paginacion}
            contenidoTabla={contenidoTabla}
            filtros={
              mostrarFiltroEventos && (
                <FiltroEvento
                  filtroEvento={filtroEvento}
                  accionCorrecta={(eventos) => {
                    setPagina(1)
                    setLimite(10)
                    setFiltroEvento(eventos.evento)
                  }}
                  accionCerrar={() => {
                    imprimir(`👀 cerrar`)
                  }}
                />
              )
            }
          />
        }
      </LayoutUser>
    </>
  )
}
export default Evento
