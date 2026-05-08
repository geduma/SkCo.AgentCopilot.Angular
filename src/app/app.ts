import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { CustomerModalService } from './core/services/customer-modal.service'
import { CustomerDetailModalComponent } from './presentation/components/customer-detail-modal/customer-detail-modal.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomerDetailModalComponent],
  template: `
    <router-outlet />
    @if (modal.selectedCustomer()) {
      <app-customer-detail-modal
        [customer]="modal.selectedCustomer()!"
        (close)="modal.close()" />
    }
  `,
})
export class App {
  readonly modal = inject(CustomerModalService)
}