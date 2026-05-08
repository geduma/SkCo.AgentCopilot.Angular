import { Injectable } from '@angular/core'

export type GenerationState = 'idle' | 'loading' | 'success' | 'error'

@Injectable({ providedIn: 'root' })
export class AiGenerationService {
  
}