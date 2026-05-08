import {
  ChangeDetectionStrategy, Component, computed, effect, inject,
  Input, OnInit, Output, EventEmitter, signal
} from '@angular/core'
import { DatePipe, DecimalPipe } from '@angular/common'
import { PerfilRiesgo } from '../../../core/models/cliente.model'
import { ClienteInsight } from '../../../core/models/cliente-insight.model'
import { CustomerService } from '../../../core/services/customer.service'
import { SegmentoClassPipe } from '../../../shared/pipes/segmento-class.pipe'

type Filtro = 'all' | 'alta-prioridad' | 'vencimientos' | 'prospectos'

@Component({
  selector: 'app-customer-grid',
  standalone: true,
  imports: [DecimalPipe, DatePipe, SegmentoClassPipe],
  templateUrl: './customer-grid.component.html',
  styleUrl: './customer-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerGridComponent implements OnInit {
  private customerService = inject(CustomerService)

  @Output() rangeChange       = new EventEmitter<string>()
  @Output() customerSelected  = new EventEmitter<ClienteInsight>()

  private _filtro = signal<Filtro>('all')

  constructor() {
    effect(() => this.rangeChange.emit(this.rangeInfo()))
  }

  @Input() set filtro(value: Filtro) {
    this._filtro.set(value)
    this.currentPage.set(1)
  }

  private allCustomers = signal<ClienteInsight[]>([])
  isLoading = signal(true)
  error     = signal<string | null>(null)

  readonly pageSize = 6
  currentPage = signal(1)

  customers = computed(() => {
    const all = this.allCustomers()
    switch (this._filtro()) {
      case 'alta-prioridad': return all.filter(c => c.diasSinContacto >= 30)
      case 'vencimientos':   return all.filter(c => c.estadoGestion === 'Pendiente' && c.diasSinContacto >= 7)
      case 'prospectos':     return all.filter(c => c.segmento === 'VIP' || c.segmento === 'Premium')
      default:               return all
    }
  })

  totalPages = computed(() => Math.ceil(this.customers().length / this.pageSize))

  pageNumbers = computed(() => {
    const total = this.totalPages()
    const current = this.currentPage()
    const start = Math.max(1, current - 2)
    const end   = Math.min(total, current + 2)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })

  paginatedCustomers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize
    return this.customers().slice(start, start + this.pageSize)
  })

  rangeInfo = computed(() => {
    const total = this.customers().length
    if (total === 0) return '0 clientes'
    const start = (this.currentPage() - 1) * this.pageSize + 1
    const end   = Math.min(this.currentPage() * this.pageSize, total)
    return `${start}–${end} de ${total}`
  })

  async ngOnInit () {
    try {
      const data = await this.customerService.getCustomers()
      this.allCustomers.set(data)
    } catch (e) {
      this.error.set('No se pudo cargar la lista de clientes.')
    } finally {
      this.isLoading.set(false)
    }
  }

  prevPage () { if (this.currentPage() > 1) this.currentPage.update(p => p - 1) }
  nextPage () { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1) }
  goToPage (p: number) { this.currentPage.set(p) }

  initials (name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  }

  perfilClass (perfil: PerfilRiesgo): string {
    const map: Record<PerfilRiesgo, string> = {
      Conservador: 'badge badge--conservador',
      Moderado:    'badge badge--moderado',
      Agresivo:    'badge badge--agresivo',
    }
    return map[perfil] ?? 'badge'
  }

  diasClass (dias: number): string {
    if (dias < 15) return 'dias-pill'
    if (dias < 30) return 'dias-pill dias-pill--warn'
    return 'dias-pill dias-pill--danger'
  }
}