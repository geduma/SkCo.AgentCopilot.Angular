import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Cliente } from '../../../../domain/clientes/models/cliente.model';
import { EstadoClassPipe } from '../../../../shared/pipes/estado-class.pipe';
import { SegmentoClassPipe } from '../../../../shared/pipes/segmento-class.pipe';

type SortKey = keyof Pick<
  Cliente,
  | 'cliente'
  | 'idCliente'
  | 'segmento'
  | 'perfilRiesgo'
  | 'saldoTotal'
  | 'productosActivos'
  | 'ultimoContacto'
  | 'diasSinContacto'
  | 'asesorAsignado'
  | 'estadoGestion'
>;

@Component({
  selector: 'app-clientes-grid',
  standalone: true,
  imports: [CommonModule, SegmentoClassPipe, EstadoClassPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clientes-grid.component.html',
  styleUrl: './clientes-grid.component.scss',
})
export class ClientesGridComponent {
  readonly clientes = input.required<Cliente[]>();
  readonly select = output<Cliente>();

  readonly sortKey = input<SortKey>('cliente');
  readonly sortDir = input<'asc' | 'desc'>('asc');
  readonly sortChange = output<{ key: SortKey; dir: 'asc' | 'desc' }>();

  readonly rows = computed(() => {
    const items = [...this.clientes()];
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    items.sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va instanceof Date && vb instanceof Date) {
        return (va.getTime() - vb.getTime()) * dir;
      }
      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * dir;
      }
      return String(va).localeCompare(String(vb), 'es') * dir;
    });
    return items;
  });

  trackById = (_: number, c: Cliente) => c.idCliente;

  toggleSort(key: SortKey): void {
    const nextDir: 'asc' | 'desc' =
      this.sortKey() === key && this.sortDir() === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ key, dir: nextDir });
  }

  onSelect(cliente: Cliente): void {
    this.select.emit(cliente);
  }
}
