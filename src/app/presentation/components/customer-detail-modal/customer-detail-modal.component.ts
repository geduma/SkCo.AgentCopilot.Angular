import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core'
import { DecimalPipe, DatePipe } from '@angular/common'
import {
  ClienteInsight,
  RiesgoFuga, PrioridadCliente, NivelUrgencia, CanalSugerido
} from '../../../core/models/cliente-insight.model'
import { PerfilRiesgo } from '../../../core/models/cliente.model'
import { SegmentoClassPipe } from '../../../shared/pipes/segmento-class.pipe'

@Component({
  selector: 'app-customer-detail-modal',
  standalone: true,
  imports: [DecimalPipe, DatePipe, SegmentoClassPipe],
  templateUrl: './customer-detail-modal.component.html',
  styleUrl: './customer-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'close.emit()' },
})
export class CustomerDetailModalComponent {
  @Input({ required: true }) customer!: ClienteInsight
  @Output() close = new EventEmitter<void>()

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  }

  perfilClass(perfil: PerfilRiesgo): string {
    const map: Record<PerfilRiesgo, string> = {
      Conservador: 'badge badge--conservador',
      Moderado:    'badge badge--moderado',
      Agresivo:    'badge badge--agresivo',
    }
    return map[perfil] ?? 'badge'
  }

  scoreClass(score: number): string {
    if (score >= 86) return 'score-bar__fill--red'
    if (score >= 61) return 'score-bar__fill--orange'
    if (score >= 31) return 'score-bar__fill--amber'
    return 'score-bar__fill--green'
  }

  riesgoClass(r: RiesgoFuga): string {
    const map: Record<RiesgoFuga, string> = {
      Bajo:  'pill pill--green',
      Medio: 'pill pill--amber',
      Alto:  'pill pill--red',
    }
    return map[r]
  }

  prioridadClass(p: PrioridadCliente): string {
    const map: Record<PrioridadCliente, string> = {
      Alta:  'pill pill--red',
      Media: 'pill pill--amber',
      Baja:  'pill pill--green',
    }
    return map[p]
  }

  urgenciaClass(u: NivelUrgencia): string {
    const map: Record<NivelUrgencia, string> = {
      Inmediata:       'pill pill--red',
      'Esta semana':   'pill pill--amber',
      Seguimiento:     'pill pill--green',
    }
    return map[u]
  }

  canalClass(c: CanalSugerido): string {
    const map: Record<CanalSugerido, string> = {
      WhatsApp: 'pill pill--green',
      Llamada:  'pill pill--blue',
      Correo:   'pill pill--amber',
      'Reunión': 'pill pill--purple',
    }
    return map[c]
  }

  tipoProductoClass(tipo: string): string {
    const map: Record<string, string> = {
      Fondo:   'pill pill--blue',
      Seguro:  'pill pill--green',
      Pensión: 'pill pill--purple',
      Plan:    'pill pill--amber',
    }
    return map[tipo] ?? 'pill'
  }

  iniciarGestion(): void {
    const phone = (this.customer.telefono ?? '').replace(/\D/g, '')
    console.log('que pasooooooooooooo', this.customer)
    if (!phone) return
    const url = `https://api.whatsapp.com/send?phone=${phone}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}