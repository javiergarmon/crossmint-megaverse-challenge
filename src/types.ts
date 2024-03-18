export enum RawAstralObjectType {
  SPACE = 'SPACE',
  POLYANET = 'POLYANET',
  SOLOON = 'SOLOON',
  COMETH = 'COMETH',
}

export enum SoloonColor {
  BLUE = 'blue',
  RED = 'red',
  PURPLE = 'purple',
  WHITE = 'white',
}

export enum ComethDirection {
  UP = 'up',
  DOWN = 'down',
  RIGHT = 'right',
  LEFT = 'left',
}

export enum AstralObjectType {
  POLYANET = 'polyanets',
  SOLOON = 'soloons',
  COMETH = 'comeths',
}

export interface Coordinate {
  row: number
  column: number
}

export type RawMap = RawAstralObjectType[][]

export class HttpError extends Error {
  constructor(res: Response) {
    super(`HttpError - Failed with status code ${res.status}`)
  }
}
