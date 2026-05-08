import { InjectionToken } from '@angular/core';
import { ClienteRepository } from './cliente.repository';

export const CLIENTE_REPOSITORY = new InjectionToken<ClienteRepository>('ClienteRepository');
