import { Injectable } from '@angular/core'
import { ClienteInsight } from '../models/cliente-insight.model'
import { AccionCritica } from '../models/accion-critica.model'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private insightsCache: ClienteInsight[] | null = null
  private accionesCache: AccionCritica[] | null = null

  async getCustomers (): Promise<ClienteInsight[]> {
    if (this.insightsCache) return this.insightsCache
    const response = await fetch('/mocks/customer-insights.mock.json')
    if (!response.ok) throw new Error(`Error cargando insights: ${response.status}`)
    this.insightsCache = await response.json() as ClienteInsight[]
    return this.insightsCache
  }

  async getAccionesCriticas (): Promise<AccionCritica[]> {
    if (this.accionesCache) return this.accionesCache
    const response = await fetch('/mocks/critical-actions.mock.json')
    if (!response.ok) throw new Error(`Error cargando acciones: ${response.status}`)
    this.accionesCache = await response.json() as AccionCritica[]
    return this.accionesCache
  }

  clearCache (): void {
    this.insightsCache = null
    this.accionesCache = null
  }

  async getCustomerById (id: number): Promise<ClienteInsight | undefined> {
    const customers = await this.getCustomers()
    return customers.find(c => c.idCliente === id)
  }
}