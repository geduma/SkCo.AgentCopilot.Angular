export interface ClienteDto {
  idCliente: number;
  cliente: string;
  segmento: string;
  perfilRiesgo: string;
  saldoTotal: number;
  productosActivos: number;
  ultimoContacto: string;
  diasSinContacto: number;
  asesorAsignado: string;
  estadoGestion: string;
}
