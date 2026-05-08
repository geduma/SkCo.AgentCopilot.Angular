import { Pipe, PipeTransform } from '@angular/core';
import { EstadoGestion } from '../../core/models/cliente.model';

@Pipe({ name: 'estadoClass', standalone: true })
export class EstadoClassPipe implements PipeTransform {
  transform(estado: EstadoGestion): string {
    const map: Record<EstadoGestion, string> = {
      Pendiente: 'status status--pendiente',
      'En gestión': 'status status--en-gestion',
      Cerrado: 'status status--cerrado',
    };
    return map[estado] ?? 'status';
  }
}
