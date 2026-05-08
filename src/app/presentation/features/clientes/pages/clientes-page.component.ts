import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { ListClientesUseCase } from '../../../../application/clientes/use-cases/list-clientes.use-case';
import { Cliente } from '../../../../domain/clientes/models/cliente.model';
import { ClientesGridComponent } from '../components/clientes-grid.component';

type SortKey =
  | 'cliente'
  | 'idCliente'
  | 'segmento'
  | 'perfilRiesgo'
  | 'saldoTotal'
  | 'productosActivos'
  | 'ultimoContacto'
  | 'diasSinContacto'
  | 'asesorAsignado'
  | 'estadoGestion';

@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientesGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clientes-page.component.html',
  styleUrl: './clientes-page.component.scss',
})
export class ClientesPageComponent {
  private readonly listClientes = inject(ListClientesUseCase);

  readonly clientes = signal<Cliente[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly searchTerm = signal('');
  readonly estadoFilter = signal<'todos' | 'Pendiente' | 'En gestión' | 'Cerrado'>('todos');

  readonly sortKey = signal<SortKey>('diasSinContacto');
  readonly sortDir = signal<'asc' | 'desc'>('desc');

  readonly filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const estado = this.estadoFilter();
    return this.clientes().filter((c) => {
      const matchTerm =
        !term ||
        c.cliente.toLowerCase().includes(term) ||
        String(c.idCliente).includes(term) ||
        c.asesorAsignado.toLowerCase().includes(term);
      const matchEstado = estado === 'todos' || c.estadoGestion === estado;
      return matchTerm && matchEstado;
    });
  });

  readonly totalClientes = computed(() => this.clientes().length);
  readonly saldoAdministrado = computed(() =>
    this.clientes().reduce((acc, c) => acc + c.saldoTotal, 0),
  );
  readonly clientesPendientes = computed(
    () => this.clientes().filter((c) => c.estadoGestion === 'Pendiente').length,
  );
  readonly clientesEnRiesgo = computed(
    () => this.clientes().filter((c) => c.diasSinContacto >= 45).length,
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.listClientes
      .execute()
      .pipe(
        catchError((err: { message?: string }) => {
          this.error.set(err?.message ?? 'No fue posible cargar los clientes.');
          return of([] as Cliente[]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((data) => this.clientes.set(data));
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onEstadoChange(value: string): void {
    this.estadoFilter.set(value as 'todos' | 'Pendiente' | 'En gestión' | 'Cerrado');
  }

  onSortChange(event: { key: SortKey; dir: 'asc' | 'desc' }): void {
    this.sortKey.set(event.key);
    this.sortDir.set(event.dir);
  }

  onSelect(cliente: Cliente): void {
    console.info('Cliente seleccionado:', cliente);
  }
}
