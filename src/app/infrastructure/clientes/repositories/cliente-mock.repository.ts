import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, map } from 'rxjs';
import { Cliente } from '../../../domain/clientes/models/cliente.model';
import { ClienteRepository } from '../../../domain/clientes/repositories/cliente.repository';
import { ClienteDto } from '../dto/cliente.dto';
import { ClienteMapper } from '../mappers/cliente.mapper';

@Injectable()
export class ClienteMockRepository implements ClienteRepository {
  private readonly http = inject(HttpClient);
  private readonly url = 'assets/mock/clientes.json';
  private readonly latencyMs = 250;

  findAll(): Observable<Cliente[]> {
    return this.http
      .get<ClienteDto[]>(this.url)
      .pipe(
        delay(this.latencyMs),
        map((dtos) => ClienteMapper.toDomainList(dtos)),
      );
  }

  findById(id: number): Observable<Cliente | null> {
    return this.http.get<ClienteDto[]>(this.url).pipe(
      delay(this.latencyMs),
      map((dtos) => {
        const found = dtos.find((dto) => dto.idCliente === id);
        return found ? ClienteMapper.toDomain(found) : null;
      }),
    );
  }
}
