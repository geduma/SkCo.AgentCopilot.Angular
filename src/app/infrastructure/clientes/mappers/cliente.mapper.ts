import {
  Cliente,
  EstadoGestion,
  PerfilRiesgo,
  SegmentoCliente,
} from '../../../domain/clientes/models/cliente.model';
import { ClienteDto } from '../dto/cliente.dto';

export const ClienteMapper = {
  toDomain(dto: ClienteDto): Cliente {
    return {
      idCliente: dto.idCliente,
      cliente: dto.cliente,
      segmento: dto.segmento as SegmentoCliente,
      perfilRiesgo: dto.perfilRiesgo as PerfilRiesgo,
      saldoTotal: dto.saldoTotal,
      productosActivos: dto.productosActivos,
      ultimoContacto: new Date(dto.ultimoContacto),
      diasSinContacto: dto.diasSinContacto,
      asesorAsignado: dto.asesorAsignado,
      estadoGestion: dto.estadoGestion as EstadoGestion,
    };
  },

  toDomainList(dtos: ClienteDto[]): Cliente[] {
    return dtos.map((dto) => ClienteMapper.toDomain(dto));
  },
};
