import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../../domain/clientes/models/cliente.model';
import { CLIENTE_REPOSITORY } from '../../../domain/clientes/repositories/cliente.repository.token';

@Injectable({ providedIn: 'root' })
export class GetClienteByIdUseCase {
  private readonly repository = inject(CLIENTE_REPOSITORY);

  execute(id: number): Observable<Cliente | null> {
    return this.repository.findById(id);
  }
}
