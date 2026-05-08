import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../../domain/clientes/models/cliente.model';
import { CLIENTE_REPOSITORY } from '../../../domain/clientes/repositories/cliente.repository.token';

@Injectable({ providedIn: 'root' })
export class ListClientesUseCase {
  private readonly repository = inject(CLIENTE_REPOSITORY);

  execute(): Observable<Cliente[]> {
    return this.repository.findAll();
  }
}
