import { Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { useAlerts, useSession } from '../../../../../common/hooks'
import { useForm } from 'react-hook-form'
import { FormInputWysiwyg } from '../../../../../common/components/ui/form/FormInputWysiwyg'
import FormInputImage from '../../../../../common/components/ui/form/FormInputImage'

export interface ModalLoginType {
  idEvento: string
  accionCorrecta: () => void
  accionCancelar: () => void
}

interface envioEmail {
  descripcion: string
  file: FileList
}
export const ModalEnviarEmail = ({
  idEvento,
  accionCorrecta,
  accionCancelar,
}: ModalLoginType) => {
  const { sesionPeticion } = useSession()
  const { Alerta } = useAlerts()
  const { handleSubmit, control } = useForm<envioEmail>({
    defaultValues: {
      descripcion: '',
      file: undefined,
    },
  })

  const handleEnviarEmail = async (data: envioEmail) => {
    const formData = new FormData()
    formData.append('descripcion', data.descripcion)
    formData.append('file', data.file[0])

    const respuesta = await sesionPeticion({
      url: `http://localhost:3000/api/evento/email/${idEvento}`,
      tipo: 'POST',
      body: formData,
    })
    Alerta({ mensaje: respuesta.mensaje, variant: 'success' })
    accionCorrecta()
  }

  return (
    <form onSubmit={handleSubmit(handleEnviarEmail)}>
      <DialogContent dividers style={{ overflowY: 'auto', height: 600 }}>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputWysiwyg
                id={'descripcion'}
                control={control}
                name="descripcion"
                label="Descripción del evento"
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <FormInputImage
              id="imagen"
              control={control}
              name="file"
              label="Agregue una imagen"
              tiposPermitidos={['jpg', 'png', 'jpeg']}
            />
          </Grid>
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
        <Button variant={'outlined'} onClick={accionCancelar}>
          Cancelar
        </Button>
        <Button variant={'contained'} type={'submit'}>
          Confirmar
        </Button>
      </DialogActions>
    </form>
  )
}

export default ModalEnviarEmail
