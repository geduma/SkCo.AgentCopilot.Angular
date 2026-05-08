import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

export interface ClienteRepository {
  findAll(): Observable<Cliente[]>;
  findById(id: number): Observable<Cliente | null>;
}
