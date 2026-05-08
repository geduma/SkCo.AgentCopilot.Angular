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

  contactosPrioritarios = computed(() => this.allCustomers().filter(c => c.diasSinContacto >= 30).length)
  aumGestionLabel       = computed(() => {
    const total = this.allCustomers().reduce((s, c) => s + c.saldoTotal, 0)
    return `$${(total / 1_000_000).toFixed(1)}M`
  })
  alertasGestion        = computed(() => this.allCustomers().filter(c => c.diasSinContacto >= 7 && c.estadoGestion === 'Pendiente').length)
  potencialCrossSell    = computed(() => this.allCustomers().filter(c => (c.segmento === 'VIP' || c.segmento === 'Premium') && c.productosActivos <= 3).length)

  readonly accionesPageSize = 3
  accionesPage = signal(1)

  readonly acciones: AccionCritica[] = [
    {
      tipo: 'critico', tipoLabel: 'CRÍTICO', fechaLabel: 'Vence hoy',
      titulo: 'Renovación vencida – Felipe Castro',
      descripcion: 'Portafolio VIP sin contacto hace 37 días. AUM: $120M. IA detecta riesgo de fuga.',
      accion: 'Contactar ahora',
    },
    {
      tipo: 'critico', tipoLabel: 'CRÍTICO', fechaLabel: 'Mañana',
      titulo: 'Alerta riesgo – Sofía Vargas',
      descripcion: 'Sin contacto 62 días. Segmento Riesgo. Requiere plan de retención inmediato.',
      accion: 'Ver perfil',
    },
    {
      tipo: 'urgente', tipoLabel: 'URGENTE', fechaLabel: 'Esta semana',
      titulo: 'Cross-sell IA – Juan Pérez',
      descripcion: 'Perfil Moderado con capacidad de inversión. IA sugiere Fondo Skandia Renta Fija.',
      accion: 'Ver propuesta',
    },
    {
      tipo: 'tarea', tipoLabel: 'TAREA', fechaLabel: 'Viernes',
      titulo: 'Seguimiento – Luis Martínez',
      descripcion: 'En plan de recuperación. Programar llamada para revisar avance.',
      accion: 'Agendar llamada',
    },
  ]

  accionesTotalPages = computed(() => Math.ceil(this.acciones.length / this.accionesPageSize))
  accionesPaginated  = computed(() => {
    const start = (this.accionesPage() - 1) * this.accionesPageSize
    return this.acciones.slice(start, start + this.accionesPageSize)
  })

  prevAccionesPage () { if (this.accionesPage() > 1) this.accionesPage.update(p => p - 1) }
  nextAccionesPage () { if (this.accionesPage() < this.accionesTotalPages()) this.accionesPage.update(p => p + 1) }

  async ngOnInit () {
    const data = await this.customerService.getCustomers().catch(() => [] as Cliente[])
    this.allCustomers.set(data)
  }

  setFiltro (f: Filtro) {
    this.filtro.set(f)
  }
}