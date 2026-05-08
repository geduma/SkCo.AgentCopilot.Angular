import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core'
import { CustomerService } from '../../../core/services/customer.service'
import { CustomerModalService } from '../../../core/services/customer-modal.service'
import { ClienteInsight } from '../../../core/models/cliente-insight.model'
import { AccionCritica } from '../../../core/models/accion-critica.model'
import { CustomerGridComponent } from '../customer-grid/customer-grid.component'

type Filtro = 'all' | 'alta-prioridad' | 'vencimientos' | 'prospectos'

@Component({
  selector: 'app-customer-page',
  standalone: true,
  imports: [CustomerGridComponent],
  templateUrl: './customer-page.component.html',
  styleUrl: './customer-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerPageComponent implements OnInit {
  private customerService = inject(CustomerService)
  private modalService    = inject(CustomerModalService)

  private allCustomers = signal<ClienteInsight[]>([])
  filtro    = signal<Filtro>('all')
  gridRange = signal('...')

  filteredCount = computed(() => {
    const all = this.allCustomers()
    switch (this.filtro()) {
      case 'alta-prioridad': return all.filter(c => c.diasSinContacto >= 30).length
      case 'vencimientos':   return all.filter(c => c.estadoGestion === 'Pendiente' && c.diasSinContacto >= 7).length
      case 'prospectos':     return all.filter(c => c.segmento === 'VIP' || c.segmento === 'Premium').length
      default:               return all.length
    }
  })

  contactosPrioritarios = computed(() => this.allCustomers().filter(c => c.diasSinContacto >= 30).length)
  aumGestionLabel       = computed(() => {
    const total = this.allCustomers().reduce((s, c) => s + c.saldoTotal, 0)
    return `$${(total / 1_000_000).toFixed(1)}M`
  })
  alertasGestion     = computed(() => this.allCustomers().filter(c => c.diasSinContacto >= 7 && c.estadoGestion === 'Pendiente').length)
  potencialCrossSell = computed(() => this.allCustomers().filter(c => c.ia.oportunidadCrossSelling).length)
  contratosSinFondeo = signal(3)

  readonly accionesPageSize = 3
  accionesPage  = signal(1)
  acciones      = signal<AccionCritica[]>([])

  accionesTotalPages = computed(() => Math.ceil(this.acciones().length / this.accionesPageSize))
  accionesPaginated  = computed(() => {
    const start = (this.accionesPage() - 1) * this.accionesPageSize
    return this.acciones().slice(start, start + this.accionesPageSize)
  })

  prevAccionesPage () { if (this.accionesPage() > 1) this.accionesPage.update(p => p - 1) }
  nextAccionesPage () { if (this.accionesPage() < this.accionesTotalPages()) this.accionesPage.update(p => p + 1) }

  async ngOnInit () {
    const [customers, accionesCriticas] = await Promise.all([
      this.customerService.getCustomers().catch(() => [] as ClienteInsight[]),
      this.customerService.getAccionesCriticas().catch(() => [] as AccionCritica[]),
    ])
    this.allCustomers.set(customers)
    this.acciones.set(accionesCriticas)
  }

  openModal (customer: ClienteInsight): void {
    this.modalService.open(customer)
  }

  setFiltro (f: Filtro) {
    this.filtro.set(f)
  }
}