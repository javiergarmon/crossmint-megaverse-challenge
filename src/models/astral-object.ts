import { type AstralObjectType } from '../types'
import { configService, httpService, type RequestParams } from '../services'

export interface AstralObjectParams {
  row: number
  column: number
  type: AstralObjectType
}

export class AstralObject {
  row: number
  column: number
  type: AstralObjectType

  constructor({ row, column, type }: AstralObjectParams) {
    this.row = row
    this.column = column
    this.type = type
  }

  async create(params?: RequestParams): Promise<void> {
    await httpService.post(`${this.type}`, {
      ...params,
      row: this.row,
      column: this.column,
      candidateId: configService.candidateId,
    })
  }
}
