import { inject, Injectable } from '@angular/core'
import { CustomerService } from '../services/customer.service'
import { Cliente } from '../models/cliente.model'

@Injectable({
  providedIn: 'root'
})
export class CustomerBusiness {
  customerService = inject(CustomerService)

  async getCustomers (): Promise<Cliente[]> {
    return new Promise((resolve, reject) => {
      this.customerService.getCustomers()
        .then(customers => {
          if (customers.length <= 0) console.error('No se encontraron clientes')
          resolve(customers)
        })
        .catch(error => reject(new Error(error)))
    })
  }

  async getCustomerById (id: number): Promise<Cliente | undefined> {
    return new Promise((resolve, reject) => {
      this.customerService.getCustomerById(id)
        .then(customer => resolve(customer))
        .catch(error => reject(new Error(error)))
    })
  }
}
