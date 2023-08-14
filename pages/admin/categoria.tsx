import type { NextPage } from 'next'
import {
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
import { CategoriaCRUDType } from '../../modules/admin/eventos/types/categoria/categoriaCRUDTypes'
import { ModalCategoria } from '../../modules/admin/eventos/ui/categoria/ModalCategoria'
import { FiltroCategoria } from '../../modules/admin/eventos/ui/categoria/FiltroCategoria'

const Categoria: NextPage = () => {
  const [categoriasData, setCategoriasData] = useState<CategoriaCRUDType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const [errorCategoriaData, setErrorCategoriaData] = useState<any>()

  const [modalCategoria, setModalCategoria] = useState(false)

  /// Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoCategoria, setMostrarAlertaEstadoCategoria] =
    useState(false)

  const [categoriaEdicion, setCategoriaEdicion] = useState<
    CategoriaCRUDType | undefined | null
  >()

  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const { sesionPeticion } = useSession()
  const { estaAutenticado, permisoUsuario } = useAuth()

  const [filtroCategoria, setFiltroCategoria] = useState<string>('')
  const [mostrarFiltroCategorias, setMostrarFiltroCategorias] = useState(false)
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

  const editarEstadoCategoriaModal = async (categoria: CategoriaCRUDType) => {
    setCategoriaEdicion(categoria) // para mostrar datos de modal en la alerta
    setMostrarAlertaEstadoCategoria(true) // para mostrar alerta de parametro
  }

  const cancelarAlertaEstadoCategoria = async () => {
    setMostrarAlertaEstadoCategoria(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setCategoriaEdicion(null)
  }

  /// Método que oculta la alerta de cambio de estado y procede
  const aceptarAlertaEstadoCategoria = async () => {
    setMostrarAlertaEstadoCategoria(false)
    if (categoriaEdicion) {
      await cambiarEstadoCategoriaPeticion(categoriaEdicion)
    }
    setCategoriaEdicion(null)
  }

  /// Petición que cambia el estado de un parámetro
  const cambiarEstadoCategoriaPeticion = async (
    categoria: CategoriaCRUDType
  ) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/categoria/${categoria.id}/${
          categoria.estado == 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        tipo: 'patch',
      })
      imprimir(`respuesta estado cateogria: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerCategoriasPeticion()
    } catch (e) {
      imprimir(`Error estado categoria`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // router para conocer la ruta actual
  const router = useRouter()

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'id', nombre: 'Id Evento', ordenar: false },
    { campo: 'nombre', nombre: 'Nombre', ordenar: false },
    { campo: 'descripcion', nombre: 'Descripción', ordenar: false },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = categoriasData.map(
    (categoriaData, indexCategoria) => [
      <Typography
        key={`${categoriaData.id}-${indexCategoria}-id`}
        variant={'body2'}
      >
        {`${categoriaData.id}`}
      </Typography>,
      <Typography
        key={`${categoriaData.id}-${indexCategoria}-nombre`}
        variant={'body2'}
      >
        {`${categoriaData.nombre}`}
      </Typography>,
      <Typography
        key={`${categoriaData.id}-${indexCategoria}-descripcion`}
        variant={'body2'}
      >{`${categoriaData.descripcion}`}</Typography>,
      <CustomMensajeEstado
        key={`${categoriaData.id}-${indexCategoria}-estado`}
        titulo={categoriaData.estado}
        descripcion={categoriaData.estado}
        color={
          categoriaData.estado == 'ACTIVO'
            ? 'success'
            : categoriaData.estado == 'INACTIVO'
            ? 'error'
            : 'info'
        }
      />,

      <Grid key={`${categoriaData.id}-${indexCategoria}-acciones`}>
        {permisos.update && (
          <IconoTooltip
            id={`cambiarEstadoParametro-${categoriaData.id}`}
            titulo={categoriaData.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
            color={categoriaData.estado == 'ACTIVO' ? 'success' : 'error'}
            accion={async () => {
              await editarEstadoCategoriaModal(categoriaData)
            }}
            desactivado={categoriaData.estado == 'PENDIENTE'}
            icono={
              categoriaData.estado == 'ACTIVO' ? 'toggle_on' : 'toggle_off'
            }
            name={
              categoriaData.estado == 'ACTIVO'
                ? 'Inactivar Parámetro'
                : 'Activar Parámetro'
            }
          />
        )}

        {permisos.update && (
          <IconoTooltip
            id={`editarParametros-${categoriaData.id}`}
            name={'Parámetros'}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, categoriaData)
              editarCategoriaModal(categoriaData)
            }}
            icono={'edit'}
          />
        )}
      </Grid>,
    ]
  )

  const acciones: Array<ReactNode> = [
    <BotonBuscar
      id={'accionFiltrarParametrosToggle'}
      key={'accionFiltrarParametrosToggle'}
      seleccionado={mostrarFiltroCategorias}
      cambiar={setMostrarFiltroCategorias}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarParametros'}
        key={`ordenarParametros`}
        label={'Ordenar parámetros'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={'actualizarParametro'}
      titulo={'Actualizar'}
      key={`accionActualizarParametro`}
      accion={async () => {
        await obtenerCategoriasPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de parámetros'}
    />,
    permisos.create && (
      <IconoBoton
        id={'agregarParametro'}
        key={'agregarParametro'}
        texto={'Agregar'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar parámetro'}
        accion={() => {
          agregarCategoriaModal()
        }}
      />
    ),
  ]

  const obtenerCategoriasPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/categoria`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroCategoria.length == 0 ? {} : { filtro: filtroCategoria }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
                orden: ordenFiltrado(ordenCriterios).join(','),
              }),
        },
      })
      setCategoriasData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorCategoriaData(null)
    } catch (e) {
      imprimir(`Error al obtener categoria`, e)
      setErrorCategoriaData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const agregarCategoriaModal = () => {
    setCategoriaEdicion(undefined)
    setModalCategoria(true)
  }
  const editarCategoriaModal = (categoria: CategoriaCRUDType) => {
    setCategoriaEdicion(categoria)
    setModalCategoria(true)
  }

  const cerrarModalCategoria = async () => {
    setModalCategoria(false)
    await delay(500)
    setCategoriaEdicion(undefined)
  }

  async function definirPermisos() {
    setPermisos(await permisoUsuario(router.pathname))
  }

  useEffect(() => {
    definirPermisos().finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estaAutenticado])

  useEffect(() => {
    if (estaAutenticado) obtenerCategoriasPeticion().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    estaAutenticado,
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroCategoria,
  ])

  useEffect(() => {
    if (!mostrarFiltroCategorias) {
      setFiltroCategoria('')
    }
  }, [mostrarFiltroCategorias])

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
        isOpen={mostrarAlertaEstadoCategoria}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          categoriaEdicion?.estado == 'ACTIVO' ? 'inactivar' : 'activar'
        } el parámetro: ${titleCase(categoriaEdicion?.nombre ?? '')} ?`}
      >
        <Button onClick={cancelarAlertaEstadoCategoria}>Cancelar</Button>
        <Button onClick={aceptarAlertaEstadoCategoria}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalCategoria}
        handleClose={cerrarModalCategoria}
        title={categoriaEdicion ? 'Editar categoria' : 'Nueva categoria'}
      >
        <ModalCategoria
          categoria={categoriaEdicion}
          accionCorrecta={() => {
            cerrarModalCategoria().finally()
            obtenerCategoriasPeticion().finally()
          }}
          accionCancelar={cerrarModalCategoria}
        />
      </CustomDialog>
      <LayoutUser title={`Categorias - ${siteName()}`}>
        <CustomDataTable
          titulo={'Categorias'}
          error={!!errorCategoriaData}
          cargando={loading}
          acciones={acciones}
          columnas={ordenCriterios}
          cambioOrdenCriterios={setOrdenCriterios}
          paginacion={paginacion}
          contenidoTabla={contenidoTabla}
          filtros={
            mostrarFiltroCategorias && (
              <FiltroCategoria
                filtroCategoria={filtroCategoria}
                accionCorrecta={(filtros) => {
                  setPagina(1)
                  setLimite(10)
                  setFiltroCategoria(filtros.categoria)
                }}
                accionCerrar={() => {
                  imprimir(`👀 cerrar`)
                }}
              />
            )
          }
        />
      </LayoutUser>
    </>
  )
}
export default Categoria
