export interface AccionCritica {
  readonly id: number
  readonly tipo: 'critico' | 'urgente' | 'tarea'
  readonly tipoLabel: string
  readonly fechaLabel: string
  readonly titulo: string
  readonly descripcion?: string
  readonly accion?: string
  readonly idCliente?: number
}