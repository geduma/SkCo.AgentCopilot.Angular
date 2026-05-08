import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core'
import { DatePipe, DecimalPipe } from '@angular/common'
import { ClienteInsight, NivelAlerta, TipoRecomendacion, Urgencia } from '../../../core/models/cliente-insight.model'
import { PerfilRiesgo } from '../../../core/models/cliente.model'
import { SegmentoClassPipe } from '../../../shared/pipes/segmento-class.pipe'

@Component({
  selector: 'app-customer-detail-modal',
  standalone: true,
  imports: [DecimalPipe, DatePipe, SegmentoClassPipe],
  templateUrl: './customer-detail-modal.component.html',
  styleUrl: './customer-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailModalComponent {
  @Input({ required: true }) customer!: ClienteInsight
  @Output() close = new EventEmitter<void>()

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

  alertaClass (nivel: NivelAlerta): string {
    const map: Record<NivelAlerta, string> = {
      bajo:    'pill pill--green',
      medio:   'pill pill--amber',
      alto:    'pill pill--orange',
      critico: 'pill pill--red',
    }
    return map[nivel]
  }

  alertaLabel (nivel: NivelAlerta): string {
    const map: Record<NivelAlerta, string> = {
      bajo: 'Bajo', medio: 'Medio', alto: 'Alto', critico: 'Crítico',
    }
    return map[nivel]
  }

  recomendacionLabel (tipo: TipoRecomendacion): string {
    const map: Record<TipoRecomendacion, string> = {
      'cross-sell':  'Venta Cruzada',
      retencion:     'Retención',
      renovacion:    'Renovación',
      rebalanceo:    'Rebalanceo',
      seguimiento:   'Seguimiento',
    }
    return map[tipo]
  }

  recomendacionClass (tipo: TipoRecomendacion): string {
    const map: Record<TipoRecomendacion, string> = {
      'cross-sell':  'pill pill--blue',
      retencion:     'pill pill--red',
      renovacion:    'pill pill--purple',
      rebalanceo:    'pill pill--amber',
      seguimiento:   'pill pill--green',
    }
    return map[tipo]
  }

  urgenciaLabel (u: Urgencia): string {
    const map: Record<Urgencia, string> = {
      hoy:           'Hoy',
      manana:        'Mañana',
      'esta-semana': 'Esta semana',
      'este-mes':    'Este mes',
    }
    return map[u]
  }

  urgenciaClass (u: Urgencia): string {
    const map: Record<Urgencia, string> = {
      hoy:           'pill pill--red',
      manana:        'pill pill--orange',
      'esta-semana': 'pill pill--amber',
      'este-mes':    'pill pill--green',
    }
    return map[u]
  }

  scoreClass (score: number): string {
    if (score >= 86) return 'score-bar__fill--red'
    if (score >= 61) return 'score-bar__fill--orange'
    if (score >= 31) return 'score-bar__fill--amber'
    return 'score-bar__fill--green'
  }

  tipoProductoClass (tipo: string): string {
    const map: Record<string, string> = {
      Fondo:   'pill pill--blue',
      Seguro:  'pill pill--green',
      Pensión: 'pill pill--purple',
      Plan:    'pill pill--amber',
    }
    return map[tipo] ?? 'pill'
  }
}