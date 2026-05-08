import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core'
import { CustomerService } from '../../../core/services/customer.service'
import { Cliente } from '../../../core/models/cliente.model'
import { CustomerGridComponent } from '../customer-grid/customer-grid.component'

interface AccionCritica {
  tipo: 'critico' | 'urgente' | 'tarea'
  tipoLabel: string
  fechaLabel: string
  titulo: string
  descripcion: string
  accion: string
}

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

  private allCustomers = signal<Cliente[]>([])
  filtro = signal<Filtro>('all')

  filteredCount = computed(() => {
    const all = this.allCustomers()
    switch (this.filtro()) {
      case 'alta-prioridad': return all.filter(c => c.diasSinContacto >= 30).length
      case 'vencimientos':   return all.filter(c => c.estadoGestion === 'Pendiente' && c.diasSinContacto >= 7).length
      case 'prospectos':     return all.filter(c => c.segmento === 'VIP' || c.segmento === 'Premium').length
      default:               return all.length
    }
  })

  firmasPendientes = computed(() => this.allCustomers().filter(c => c.estadoGestion === 'Pendiente').length)
  saldoTotalLabel  = computed(() => {
    const total = this.allCustomers().reduce((s, c) => s + c.saldoTotal, 0)
    return `$${(total / 1_000_000).toFixed(1)}M`
  })
  vencimientos7d   = computed(() => this.allCustomers().filter(c => c.diasSinContacto >= 7 && c.estadoGestion === 'Pendiente').length)
  prospectosVip    = computed(() => this.allCustomers().filter(c => c.segmento === 'VIP' || c.segmento === 'Premium').length)

  readonly acciones: AccionCritica[] = [
    {
      tipo: 'critico', tipoLabel: 'CRÍTICO', fechaLabel: 'Vence hoy',
      titulo: 'Propuesta - Grupo Ortiz',
      descripcion: 'Documento visualizado hace 2 horas.',
      accion: 'Contactar',
    },
    {
      tipo: 'urgente', tipoLabel: 'URGENTE', fechaLabel: 'Mañana',
      titulo: 'Follow-up: Elena Martos',
      descripcion: 'Alta probabilidad de venta cruzada.',
      accion: 'Ver Perfil 360',
    },
    {
      tipo: 'tarea', tipoLabel: 'TAREA', fechaLabel: 'Viernes',
      titulo: 'Renovación: TechFlow SL',
      descripcion: '',
      accion: 'Enviar Firma',
    },
  ]

  async ngOnInit () {
    const data = await this.customerService.getCustomers().catch(() => [] as Cliente[])
    this.allCustomers.set(data)
  }

  setFiltro (f: Filtro) {
    this.filtro.set(f)
  }
}