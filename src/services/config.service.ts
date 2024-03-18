import 'dotenv/config'

export class ConfigService {
  readonly apiBaseUrl: string
  readonly candidateId: string
  readonly debug: boolean

  constructor() {
    const apiBaseUrl = process.env.API_BASE_URL
    const candidateId = process.env.CANDIDATE_ID
    const debug = process.env.DEBUG ?? ''

    if (!apiBaseUrl) {
      throw new Error('Env variable API_BASE_URL is not valid')
    }

    if (!candidateId) {
      throw new Error('Env variable CANDIDATE_ID is not valid')
    }

    this.apiBaseUrl = apiBaseUrl
    this.candidateId = candidateId
    this.debug = debug.toString().toLowerCase() === 'true'
  }
}

export const configService = new ConfigService()
