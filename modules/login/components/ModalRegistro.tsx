import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormInputText } from '../../../common/components/ui/form'
import {
  Box,
  Button,
  DialogActions,
  Fade,
  Grid,
  Typography,
} from '@mui/material'
import ProgresoLineal from '../../../common/components/ui/progreso/ProgresoLineal'
import { imprimir } from '../../../common/utils/imprimir'
import { useAlerts } from '../../../common/hooks'
import { CrearCuentaType } from '../types/nuevaPassPeticionTypes'
import { InterpreteMensajes, delay } from '../../../common/utils'
import { Servicios } from '../../../common/services'
import { Constantes } from '../../../config'
import { NivelSeguridadPass } from '../../../common/components/ui/utils/NivelSeguridadPass'
import { Icono } from '../../../common/components/ui'
import { isValidEmail } from '../../../common/utils/validations'

export interface ModalLoginType {
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const ModalRegistro = ({
  //accionCorrecta,
  accionCancelar,
}: ModalLoginType) => {
  const [indicadorCarga, setIndicadorCarga] = useState<boolean>(false)

  const [indicadorCreacionCuenta, setIndicadorCreacionCuenta] =
    useState<boolean>(false)
  const { Alerta } = useAlerts()

  const { handleSubmit, control, reset, watch } = useForm<CrearCuentaType>({
    defaultValues: {},
  })

  const newPassword1Watch = watch('newPassword1')

  const guardarActualizarCuenta = async (data: CrearCuentaType) => {
    await guardarActualizarCuentaPeticion(data)
  }

  const guardarActualizarCuentaPeticion = async (cuenta: CrearCuentaType) => {
    try {
      setIndicadorCarga(true)
      await delay(1000)
      const respuesta = await Servicios.peticion({
        url: `${Constantes.baseUrl}/usuarios/crear-cuenta`,
        tipo: 'post',
        body: { ...cuenta, contrasenaNueva: cuenta.newPassword1 },
      })
      setIndicadorCreacionCuenta(true)
      imprimir(InterpreteMensajes(respuesta))
    } catch (e) {
      imprimir(`Error al crear o actualizar cuenta: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setIndicadorCarga(false)
    }
  }

  return (
    <Box padding={3}>
      {indicadorCreacionCuenta && (
        <Fade in={indicadorCreacionCuenta} timeout={500}>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Icono fontSize={'large'} color={'success'}>
              check_circle
            </Icono>
            <Box height={'15px'} />
            <Typography sx={{ fontWeight: 'medium' }} variant={'subtitle2'}>
              ¡Tu cuenta ha sido registrada!
            </Typography>
            <Box height={'15px'} />
            <Typography variant="body2" color="text.secondary">
              Para activar tu cuenta, ingresa al enlace enviado a tu correo
            </Typography>
            <Box height={'15px'} />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              onClick={() => {
                reset()
                setIndicadorCreacionCuenta(false)
                accionCancelar()
              }}
            >
              <Typography sx={{ fontWeight: 'medium' }}>Entendido</Typography>
            </Button>
          </Box>
        </Fade>
      )}
      {!indicadorCreacionCuenta && (
        <form onSubmit={handleSubmit(guardarActualizarCuenta)}>
          <Grid>
            <Box height={'20px'} />
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputText
                  id={'nombres'}
                  control={control}
                  name="nombres"
                  type={'text'}
                  label="Nombre de usuario"
                  disabled={indicadorCarga}
                  rules={{ required: 'Este campo es requerido' }}
                />
              </Grid>
            </Grid>
            <Box height={'10px'} />
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputText
                  id={'correoElectronico'}
                  control={control}
                  name="correoElectronico"
                  label="Correo electrónico"
                  disabled={indicadorCarga}
                  rules={{
                    required: 'Este campo es requerido',
                    validate: (value) => {
                      if (!isValidEmail(value)) return 'No es un correo válido'
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Box height={'10px'} />
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputText
                  id={'newPassword1'}
                  control={control}
                  name="newPassword1"
                  label="Nueva contraseña"
                  disabled={indicadorCarga}
                  type={'password'}
                  rules={{ required: 'Este campo es requerido' }}
                />
              </Grid>

              {watch('newPassword1') && (
                <Grid item xs={12} sm={12} md={12}>
                  <NivelSeguridadPass pass={newPassword1Watch} />
                </Grid>
              )}
              <Grid item xs={12} sm={12} md={12}>
                <FormInputText
                  id={'newPassword2'}
                  control={control}
                  name="newPassword2"
                  label="Repita su nueva contraseña"
                  disabled={indicadorCarga}
                  type={'password'}
                  rules={{
                    required: 'Este campo es requerido',
                    validate: (value: string) => {
                      if (value != newPassword1Watch)
                        return 'La contraseña no coincide'
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Box height={'20px'} />
          <ProgresoLineal mostrar={indicadorCarga} />
          <Box height={'5px'} />
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
              onClick={accionCancelar}
              disabled={indicadorCarga}
            >
              Cancelar
            </Button>
            <Button
              variant={'contained'}
              type={'submit'}
              disabled={indicadorCarga}
            >
              Crear cuenta
            </Button>
          </DialogActions>
        </form>
      )}
    </Box>
  )
}
export default ModalRegistro
