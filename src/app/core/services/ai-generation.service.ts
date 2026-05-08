import { Injectable, signal } from '@angular/core'
import { environment } from '../../../environments/environment'
import { INVESTMENT_ALERT_PROMPT } from '../prompts/investment-alert.prompt'
import { AccionCritica } from '../models/accion-critica.model'
import { CustomerService } from './customer.service'

export type GenerationState = 'idle' | 'loading' | 'success' | 'error'

@Injectable({ providedIn: 'root' })
export class AiGenerationService {
  readonly state = signal<GenerationState>('idle')
  readonly error = signal<string | null>(null)
  readonly lastGenerated = signal<AccionCritica[] | null>(null)

  private readonly OLLAMA_API_URL = 'https://api.ollama.com/v1/generate'
  private readonly ollamaApiKey = environment.ollamaApiKey
  private readonly ollamaModel = environment.ollamaModel

  constructor(private customerService: CustomerService) {}

  async regenerateInsights(): Promise<void> {
    if (this.state() === 'loading') return

    this.state.set('loading')
    this.error.set(null)

    try {
      const response = await fetch(this.OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.ollamaApiKey}`,
        },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt: INVESTMENT_ALERT_PROMPT,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 500,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      const jsonString = data.response.trim()

      const parsedData = this.parseJsonResponse(jsonString)

      await this.writeToMockFile(parsedData)

      this.lastGenerated.set(parsedData)

      this.customerService.clearCache()
      this.customerService.setAccionesCache(parsedData)

      this.state.set('success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.error.set(message)
      this.state.set('error')
      console.error('Error en consulta a Ollama Cloud:', message)
    }
  }

  private parseJsonResponse(response: string): AccionCritica[] {
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No se encontró JSON válido en la respuesta')
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (!Array.isArray(parsed)) {
      throw new Error('La respuesta no es un arreglo válido')
    }

    return parsed.map((item, index) => ({
      id: item.id ?? index + 1,
      tipo: item.tipo ?? 'tarea',
      tipoLabel: item.tipoLabel ?? 'TAREA',
      fechaLabel: item.fechaLabel ?? 'Esta semana',
      titulo: item.titulo ?? '',
      descripcion: item.descripcion ?? '',
      accion: 'Revisar',
      idCliente: item.idCliente ?? 0,
    }))
  }

  private async writeToMockFile(data: AccionCritica[]): Promise<void> {
    const jsonContent = JSON.stringify(data, null, 2)

    try {
      const response = await fetch('/api/mock/critical-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonContent,
      })

      if (response.ok) {
        console.log('Mock file updated successfully')
        return
      }
    } catch {
      console.warn('Backend not available, using in-memory cache')
    }

    localStorage.setItem('critical-actions-override', jsonContent)
  }
}