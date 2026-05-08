import { Injectable, signal } from '@angular/core'
import { ClienteInsight } from '../models/cliente-insight.model'

@Injectable({ providedIn: 'root' })
export class CustomerModalService {
  readonly selectedCustomer = signal<ClienteInsight | null>(null)

  open(customer: ClienteInsight): void {
    this.selectedCustomer.set(customer)
  }

  close(): void {
    this.selectedCustomer.set(null)
  }
}