import { Provider } from '@angular/core';
import { CLIENTE_REPOSITORY } from '../../domain/clientes/repositories/cliente.repository.token';
import { environment } from '../../../environments/environment';
import { ClienteHttpRepository } from './repositories/cliente-http.repository';
import { ClienteMockRepository } from './repositories/cliente-mock.repository';

export function provideClientesInfrastructure(): Provider[] {
  if (environment.useMock) {
    return [
      ClienteMockRepository,
      { provide: CLIENTE_REPOSITORY, useExisting: ClienteMockRepository },
    ];
  }

  return [
    ClienteHttpRepository,
    { provide: CLIENTE_REPOSITORY, useExisting: ClienteHttpRepository },
  ];
}
