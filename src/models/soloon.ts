import { type SoloonColor, type Coordinate, AstralObjectType } from '../types'
import { AstralObject } from '.'

export class Soloon extends AstralObject {
  color: SoloonColor

  constructor(input: Coordinate & { color: SoloonColor }) {
    super({ ...input, type: AstralObjectType.SOLOON })
    this.color = input.color
  }

  async create(): Promise<void> {
    await super.create({ color: this.color })
  }
}
