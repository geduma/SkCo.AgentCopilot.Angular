import { Cliente } from './cliente.model'

export type TipoProducto = 'Fondo' | 'Seguro' | 'Pensión' | 'Plan'
export type NivelAlerta = 'bajo' | 'medio' | 'alto' | 'critico'
export type TipoRecomendacion = 'cross-sell' | 'retencion' | 'renovacion' | 'rebalanceo' | 'seguimiento'
export type Urgencia = 'hoy' | 'manana' | 'esta-semana' | 'este-mes'

export interface ProductoDetalle {
  readonly id: string
  readonly nombre: string
  readonly tipo: TipoProducto
  readonly saldo: number
}

export interface ClienteIA {
  readonly scoreContacto: number
  readonly nivelAlerta: NivelAlerta
  readonly tipoRecomendacion: TipoRecomendacion
  readonly productoSugerido: string
  readonly razonamiento: string
  readonly potencialInversion: number
  readonly proximaAccion: string
  readonly urgencia: Urgencia
}

export interface ClienteInsight extends Cliente {
  readonly productosDetalle: ProductoDetalle[]
  readonly ia: ClienteIA
}