import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { delay, InterpreteMensajes } from '../../../../../common/utils'
import { Constantes } from '../../../../../config'

import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material'
import {
  FormInputDate,
  FormInputText,
} from '../../../../../common/components/ui/form'
import ProgresoLineal from '../../../../../common/components/ui/progreso/ProgresoLineal'
import { useAlerts, useSession } from '../../../../../common/hooks'
import { imprimir } from '../../../../../common/utils/imprimir'
import {
  CrearEditarEventoCRUDType,
  EventoCRUDType,
} from '../../types/evento/eventoCRUDTypes'
import { FormInputAutocomplete } from '../../../../../common/components/ui/form/FormInputAutocomplete'
import { CategoriaCRUDType } from '../../types/categoria/categoriaCRUDTypes'
import dayjs from 'dayjs'
import FormInputImage from '../../../../../common/components/ui/form/FormInputImage'
import { FormInputWysiwyg } from '../../../../../common/components/ui/form/FormInputWysiwyg'

export interface ModalEventoType {
  evento?: EventoCRUDType | null
  accionCorrecta: () => void
  accionCancelar: () => void
}
interface optionsSelect {
  key: string
  label: string
  value: string
}
const initialModalidad = [
  {
    key: '1',
    label: 'Presencial',
    value: 'PRESENCIAL',
  },
  {
    key: '2',
    label: 'Virtual',
    value: 'VIRTUAL',
  },
]
export const ModalEvento = ({
  evento,
  accionCorrecta,
  accionCancelar,
}: ModalEventoType) => {
  const [categoriaOptions, setCategoriaOptions] = useState<optionsSelect[]>([])
  const [modalidadOption] = useState(initialModalidad)
  const [loadingModal, setLoadingModal] = useState<boolean>(false)
  const { Alerta } = useAlerts()

  const { sesionPeticion } = useSession()

  const { handleSubmit, control } = useForm<CrearEditarEventoCRUDType>({
    defaultValues: {
      id: evento?.id,
      nombre: evento?.nombre,
      fechaEvento: evento?.fechaEvento,
      ubicacion: evento?.ubicacion,
      descripcion: evento?.descripcion,
      modalidad: evento?.modalidad,
      categoria: evento?.categoria?.id,
      imagenEvento: null,
    },
  })

  const guardarActualizarEvento = async (data: CrearEditarEventoCRUDType) => {
    await guardarActualizarEventoPeticion(data)
  }

  const guardarActualizarEventoPeticion = async (
    evento: CrearEditarEventoCRUDType
  ) => {
    try {
      setLoadingModal(true)
      await delay(1000)
      const formData = new FormData()
      const moda: any = evento.modalidad
      const cate: any = evento.categoria
      formData.append('nombre', evento.nombre)
      formData.append('fechaEvento', evento.fechaEvento)
      formData.append('ubicacion', evento.ubicacion)
      formData.append('descripcion', evento.descripcion)
      formData.append('modalidad', moda.value)
      formData.append('categoria', cate.value)
      if (evento.imagenEvento) {
        formData.append('file', evento.imagenEvento[0])
      }
   
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/evento${evento.id ? `/${evento.id}` : ''}`,
        tipo: !!evento.id ? 'patch' : 'post',
        body: formData,
      })
      //console.log(evento)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar el evento`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  const obtenerCategorias = async () => {
    try {
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/categoria`,
      })
      const categoriasActivas = respuesta.datos.filas.filter(
        (categoria: CategoriaCRUDType) => categoria.estado === 'ACTIVO'
      )
      const options: optionsSelect[] = categoriasActivas.map(
        (categoria: CategoriaCRUDType) => ({
          key: categoria.id,
          label: categoria.nombre,
          value: categoria.id,
        })
      )
      setCategoriaOptions(options)
    } catch (error) {
      imprimir(error)
    }
  }

  useEffect(() => {
    obtenerCategorias()
  }, [])

  return (
    <form onSubmit={handleSubmit(guardarActualizarEvento)}>
      <DialogContent dividers style={{ overflowY: 'auto', height: 600 }} >
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputAutocomplete
                control={control}
                id={'nombre'}
                name="categoria"
                label="Categorias Disponibles"
                options={categoriaOptions}    
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'nombre'}
                control={control}
                name="nombre"
                label="Nombre"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputDate
                minDate={dayjs()}
                maxDate={dayjs().add(1, 'month')}
                id={'fechaEvento'}
                control={control}
                name="fechaEvento"
                label="Fecha del Evento"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputAutocomplete
                control={control}
                id={'modalidad'}
                name="modalidad"
                label="Modalidad del Evento"
                options={modalidadOption}
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Box height={'15px'} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'ubicacionLink'}
                control={control}
                name="ubicacion"
                label="Ubicación o Línk"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputImage
                id="id-evento"
                control={control}
                name="imagenEvento"
                label="Agregue una imagen"
                tiposPermitidos={['jpg', 'png', 'jpeg']}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputWysiwyg
                id={'descripcion'}
                control={control}
                name="descripcion"
                label="Descripción del evento"
              />
            </Grid>
          </Grid>
          <Box height={'10px'} />
          <ProgresoLineal mostrar={loadingModal} />
          <Box height={'5px'} />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          my: 1,
          mx: 2,
          justifyContent: {
            lg: 'flex-end',
            md: 'flex-end',
            xs: 'center',
            sm: 'center',
          },
        }}
      >
        <Button
          variant={'outlined'}
          disabled={loadingModal}
          onClick={accionCancelar}
        >
          Cancelar
        </Button>
        <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  )
}
