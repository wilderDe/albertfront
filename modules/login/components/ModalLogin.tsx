import { useState } from 'react'
import { LoginType } from '../types/loginTypes'
import { useForm } from 'react-hook-form'
import { FormInputText } from '../../../common/components/ui/form'
import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material'
import ProgresoLineal from '../../../common/components/ui/progreso/ProgresoLineal'
import { imprimir } from '../../../common/utils/imprimir'
import { useAuth } from '../../../context/auth'

export interface ModalLoginType {
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const ModalLogin = ({
  accionCorrecta,
  accionCancelar,
}: ModalLoginType) => {
  const { ingresar, progresoLogin } = useAuth()
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  const { handleSubmit, control } = useForm<LoginType>({
    defaultValues: {
      usuario: 'ADMINISTRADOR-ORGANIZADOR',
      contrasena: '123',
    },
  })

  const validarCredenciales = async ({ usuario, contrasena }: LoginType) => {
    try {
      setLoadingModal(true)
      //Peticion
      imprimir({ usuario, contrasena })
      await ingresar({ usuario, contrasena })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar la categoria`, e)
    } finally {
      setLoadingModal(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(validarCredenciales)}>
      <DialogContent>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'usuario'}
                control={control}
                name="usuario"
                label="Usuario"
                size={'medium'}
                labelVariant={'subtitle1'}
                disabled={progresoLogin}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Box height={'15px'} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'contrasena'}
                control={control}
                name="contrasena"
                label="Contraseña"
                size={'medium'}
                labelVariant={'subtitle1'}
                type={'password'}
                disabled={progresoLogin}
                rules={{
                  required: 'Este campo es requerido',
                  minLength: {
                    value: 3,
                    message: 'Mínimo 3 caracteres',
                  },
                }}
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
          Ingresar
        </Button>
      </DialogActions>
    </form>
  )
}

export default ModalLogin
