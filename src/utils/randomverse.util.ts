import {
  ComethDirection,
  RawAstralObjectType,
  SoloonColor,
  type RawMap,
} from '../types'

const astralObjects = Object.keys(RawAstralObjectType)
const comethDirections = Object.keys(ComethDirection)
const soloonColors = Object.keys(SoloonColor)

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem(items: string[]): string {
  return items[Math.floor(Math.random() * items.length)]
}

export interface Randomverse {
  goal: RawMap
  apiCallsNeeded: number
}

interface GetRandomverseParams {
  minRows: number
  maxRows: number
  minColumns: number
  maxColumns: number
}

export function getRandomverse({
  minRows,
  maxRows,
  minColumns,
  maxColumns,
}: GetRandomverseParams): Randomverse {
  const [rows, columns] = [
    randomInRange(minRows, maxRows),
    randomInRange(minColumns, maxColumns),
  ]

  let apiCallsNeeded = 0
  const goal = new Array(rows)

  for (let i = 0; i < rows; i++) {
    goal[i] = new Array(columns)
    for (let j = 0; j < columns; j++) {
      const item = randomItem(astralObjects)
      let prefix

      if (item === RawAstralObjectType.COMETH) {
        prefix = randomItem(comethDirections)
      } else if (item === RawAstralObjectType.SOLOON) {
        prefix = randomItem(soloonColors)
      }

      goal[i][j] = `${prefix ? `${prefix}_` : ''}${item}`

      if (item !== RawAstralObjectType.SPACE) {
        apiCallsNeeded++
      }
    }
  }

  return {
    goal,
    apiCallsNeeded,
  }
}
