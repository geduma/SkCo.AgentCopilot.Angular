import { Cliente } from './cliente.model'

export type TipoProducto = 'Fondo' | 'Seguro' | 'Pensión' | 'Plan'
export type RiesgoFuga = 'Bajo' | 'Medio' | 'Alto'
export type PrioridadCliente = 'Alta' | 'Media' | 'Baja'
export type NivelUrgencia = 'Inmediata' | 'Esta semana' | 'Seguimiento'
export type CanalSugerido = 'WhatsApp' | 'Llamada' | 'Correo' | 'Reunión'

export interface ProductoDetalle {
  readonly id: string
  readonly nombre: string
  readonly tipo: TipoProducto
  readonly saldo: number
}

export interface ProductoRecomendado {
  readonly productoId: string
  readonly nombreProducto: string
}

export interface ClienteIA {
  readonly scoreComercial: number
  readonly probabilidadInversion: number
  readonly compatibilidadProducto: number
  readonly riesgoFuga: RiesgoFuga
  readonly prioridad: PrioridadCliente
  readonly nivelUrgencia: NivelUrgencia
  readonly canalSugerido: CanalSugerido
  readonly oportunidadCrossSelling: boolean
  readonly motivoIA: string
  readonly accionSugerida: string
  readonly resumenCliente: string
  readonly productoRecomendado: ProductoRecomendado
}

export interface ClienteInsight extends Cliente {
  readonly productosDetalle: ProductoDetalle[]
  readonly ia: ClienteIA
}