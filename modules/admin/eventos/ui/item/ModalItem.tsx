import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { delay, InterpreteMensajes } from '../../../../../common/utils'
import { Constantes } from '../../../../../config'

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  makeStyles,
} from '@mui/material'
import { FormInputText } from '../../../../../common/components/ui/form'
import ProgresoLineal from '../../../../../common/components/ui/progreso/ProgresoLineal'
import { useAlerts, useSession } from '../../../../../common/hooks'
import { imprimir } from '../../../../../common/utils/imprimir'
import {
  CrearEditarItemCRUDType,
  ItemCRUDType,
} from '../../types/item/itemCRUDType'
import { FormInputAutocomplete } from '../../../../../common/components/ui/form/FormInputAutocomplete'
import { EventoCRUDType } from '../../types/evento/eventoCRUDTypes'
import FormInputImage from '../../../../../common/components/ui/form/FormInputImage'
import { FormInputWysiwyg } from '../../../../../common/components/ui/form/FormInputWysiwyg'

export interface ModalItemType {
  item?: ItemCRUDType | null
  accionCorrecta: () => void
  accionCancelar: () => void
}
interface optionsSelect {
  key: string
  label: string
  value: string
}

export const ModalItem = ({
  item,
  accionCorrecta,
  accionCancelar,
}: ModalItemType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)
  const [eventoOptions, seteventoOptions] = useState<optionsSelect[]>([])
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()

  const { handleSubmit, control } = useForm<CrearEditarItemCRUDType>({
    defaultValues: {
      id: item?.id,
      expositor: item?.expositor,
      tema: item?.tema,
      detalles: item?.detalles,
      horaInicio: item?.horaInicio,
      horaFinal: item?.horaFinal,
      evento: item?.evento?.id,
      imagenItem: null,
    },
  })
  const guardarActualizarItem = async (data: CrearEditarItemCRUDType) => {
    await guardarActualizarItemPeticion(data)
  }

  const guardarActualizarItemPeticion = async (
    item: CrearEditarItemCRUDType
  ) => {
    try {
      setLoadingModal(true)
      await delay(1000)

      const formData = new FormData()

      const even: any = item.evento
      formData.append('expositor', item.expositor)
      formData.append('tema', item.tema)
      formData.append('detalles', item.detalles)
      formData.append('horaInicio', item.horaInicio)
      formData.append('horaFinal', item.horaFinal)
      formData.append('evento', even.value)
      if (item.imagenItem) {
        formData.append('file', item.imagenItem[0])
      }
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/item${item.id ? `/${item.id}` : ''}`,
        tipo: !!item.id ? 'patch' : 'post',
        body: formData,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar el item`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  const obtenerEventos = async () => {
    try {
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/evento/formulario/opt`,
      })
      const options: optionsSelect[] = respuesta.datos.map(
        (evento: EventoCRUDType) => ({
          key: evento.id,
          label: evento.nombre,
          value: evento.id,
        })
      )
      seteventoOptions(options)
    } catch (error) {
      imprimir(error)
    }
  }

  useEffect(() => {
    obtenerEventos()
  }, [])

  return (
    <form onSubmit={handleSubmit(guardarActualizarItem)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'expositor'}
                control={control}
                name="expositor"
                label="Expositor"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'tema'}
                control={control}
                name="tema"
                label="Tema"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Box height={'15px'} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <Controller
                control={control}
                name="horaInicio"
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Hora Inicio"
                    style={{ width: '100%' }}
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Controller
                control={control}
                name="horaFinal"
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    style={{ width: '100%' }}
                    label="Hora Final"
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box height={'15px'} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputAutocomplete
                control={control}
                id={'nombre'}
                name="evento"
                label="Eventos Disponibles"
                options={eventoOptions}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Box height={'15px'} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputWysiwyg
                id={'detalles'}
                control={control}
                name="detalles"
                label="Descripcion de Tema que se va a realizar"
              />
            </Grid>
          </Grid>
          <Box height={'15px'} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputImage
                id="id-item"
                control={control}
                name="imagenItem"
                label="Agregue una imagen"
                tiposPermitidos={['jpg', 'png', 'jpeg']}
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
