import { Box, Grid } from '@mui/material'
import { FormInputText } from '../../../../../common/components/ui/form'
import { useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'
import { useEffect } from 'react'

export interface FiltroType {
  item: string
}

export interface FiltroItemType {
  filtroItem: string
  accionCorrecta: (filtros: FiltroType) => void
  accionCerrar: () => void
}

export const FiltroItem = ({
  filtroItem,
  accionCorrecta,
}: FiltroItemType) => {
  const { control, watch } = useForm<FiltroType>({
    defaultValues: {
      item: filtroItem,
    },
  })

  const eventoItem: string | undefined = watch('item')

  useEffect(() => {
    actualizacionFiltros({
      item: eventoItem,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventoItem])

  const debounced = useDebouncedCallback((filtros: FiltroType) => {
    accionCorrecta(filtros)
  }, 1000)

  const actualizacionFiltros = (filtros: FiltroType) => {
    debounced(filtros)
  }

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={12} md={6}>
          <FormInputText
            id={'item'}
            name={'item'}
            control={control}
            label={'Buscar Item por Expositor, Tema y Nombre del Evento'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
      </Grid>
    </Box>
  )
}
