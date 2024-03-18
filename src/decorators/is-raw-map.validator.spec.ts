import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { MapGoalResponse } from '../models'

describe('IsRawMap', () => {
  it('works', async () => {
    const instance = plainToInstance(MapGoalResponse, {
      goal: [
        ['BLUE_SOLOON', 'SPACE', 'SPACE'],
        ['SPACE', 'POLYANET', 'LEFT_COMETH'],
      ],
    })

    const errors = await validate(instance)
    expect(errors).toHaveLength(0)
  })

  it('fails - invalid type', async () => {
    const instance = plainToInstance(MapGoalResponse, {
      goal: [
        ['BLUE_WEIRD', 'SPACE', 'SPACE'],
        ['SPACE', 'POLYANET', 'LEFT_COMETH'],
      ],
    })

    const errors = await validate(instance)
    expect(errors).toHaveLength(1)
    expect(errors).toMatchObject([
      {
        constraints: {
          isRawMap:
            'goal must be a 2D array of RawAstralObjectType values with rows with the same length',
        },
      },
    ])
  })

  it('fails - invalid property', async () => {
    const instance = plainToInstance(MapGoalResponse, {
      goal: [
        ['WEIRD_SOLOON', 'SPACE', 'SPACE'],
        ['SPACE', 'POLYANET', 'LEFT_COMETH'],
      ],
    })

    const errors = await validate(instance)
    expect(errors).toHaveLength(1)
    expect(errors).toMatchObject([
      {
        constraints: {
          isRawMap:
            'goal must be a 2D array of RawAstralObjectType values with rows with the same length',
        },
      },
    ])
  })

  it('fails - invalid type', async () => {
    const instance = plainToInstance(MapGoalResponse, {
      goal: null,
    })

    const errors = await validate(instance)
    expect(errors).toHaveLength(1)
    expect(errors).toMatchObject([
      {
        constraints: {
          isRawMap:
            'goal must be a 2D array of RawAstralObjectType values with rows with the same length',
        },
      },
    ])
  })

  it('fails - columns number mismatch', async () => {
    const instance = plainToInstance(MapGoalResponse, {
      goal: [['WEIRD_SOLOON', 'SPACE', 'SPACE'], ['SPACE']],
    })

    const errors = await validate(instance)
    expect(errors).toHaveLength(1)
    expect(errors).toMatchObject([
      {
        constraints: {
          isRawMap:
            'goal must be a 2D array of RawAstralObjectType values with rows with the same length',
        },
      },
    ])
  })
})
