export type SegmentoCliente =
  | 'VIP'
  | 'Premium'
  | 'Estable'
  | 'Oportunidad'
  | 'Recuperación'
  | 'Riesgo'
  | 'Nuevo Cliente';

export type PerfilRiesgo = 'Conservador' | 'Moderado' | 'Agresivo';

export type EstadoGestion = 'Pendiente' | 'En gestión' | 'Cerrado';

export interface Cliente {
  readonly idCliente: number;
  readonly cliente: string;
  readonly asesorId: number;
  readonly segmento: SegmentoCliente;
  readonly perfilRiesgo: PerfilRiesgo;
  readonly saldoTotal: number;
  readonly productosActivos: number;
  readonly ultimoContacto: Date;
  readonly diasSinContacto: number;
  readonly asesorAsignado: string;
  readonly estadoGestion: EstadoGestion;
  readonly telefono: string;
}
