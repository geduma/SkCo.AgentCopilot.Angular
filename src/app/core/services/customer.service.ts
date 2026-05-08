import { Injectable } from '@angular/core'
import { Cliente } from '../models/cliente.model'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private cache: Cliente[] | null = null

  async getCustomers (): Promise<Cliente[]> {
    if (this.cache) return this.cache
    const response = await fetch('/mocks/customers.mock.json')
    if (!response.ok) throw new Error(`Error cargando clientes: ${response.status}`)
    this.cache = await response.json() as Cliente[]
    return this.cache
  }

  async getCustomerById (id: number): Promise<Cliente | undefined> {
    const customers = await this.getCustomers()
    return customers.find(c => c.idCliente === id)
  }
}