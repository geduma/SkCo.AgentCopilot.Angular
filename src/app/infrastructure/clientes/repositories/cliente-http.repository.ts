import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Cliente } from '../../../domain/clientes/models/cliente.model';
import { ClienteRepository } from '../../../domain/clientes/repositories/cliente.repository';
import { API_BASE_URL } from '../../../core/tokens/api.tokens';
import { ClienteDto } from '../dto/cliente.dto';
import { ClienteMapper } from '../mappers/cliente.mapper';

@Injectable()
export class ClienteHttpRepository implements ClienteRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly resource = '/clientes';

  findAll(): Observable<Cliente[]> {
    return this.http
      .get<ClienteDto[]>(`${this.baseUrl}${this.resource}`)
      .pipe(map((dtos) => ClienteMapper.toDomainList(dtos)));
  }

  findById(id: number): Observable<Cliente | null> {
    return this.http
      .get<ClienteDto>(`${this.baseUrl}${this.resource}/${id}`)
      .pipe(map((dto) => (dto ? ClienteMapper.toDomain(dto) : null)));
  }
}
