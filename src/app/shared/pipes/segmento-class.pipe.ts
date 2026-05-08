import { Pipe, PipeTransform } from '@angular/core';
import { SegmentoCliente } from '../../core/models/cliente.model';

@Pipe({ name: 'segmentoClass', standalone: true })
export class SegmentoClassPipe implements PipeTransform {
  transform(segmento: SegmentoCliente): string {
    const map: Record<SegmentoCliente, string> = {
      VIP: 'badge badge--vip',
      Premium: 'badge badge--premium',
      Estable: 'badge badge--estable',
      Oportunidad: 'badge badge--oportunidad',
      'Recuperación': 'badge badge--recuperacion',
      Riesgo: 'badge badge--riesgo',
      'Nuevo Cliente': 'badge badge--nuevo',
    };
    return map[segmento] ?? 'badge';
  }
}
