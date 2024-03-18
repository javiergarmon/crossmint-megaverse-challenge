import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from 'class-validator'
import { ComethDirection, RawAstralObjectType, SoloonColor } from '../types'

const rawAstralObjectsKeys = Object.keys(RawAstralObjectType)
const astralObjectPropertyValidation = {
  [RawAstralObjectType.COMETH]: Object.keys(ComethDirection),
  [RawAstralObjectType.SOLOON]: Object.keys(SoloonColor),
}

/**
 * class-validator does not support 2D arrays, so this custom validator does the work
 *
 * @param validationOptions
 * @returns
 */
export function IsRawMap(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isRawMap',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false
          }

          const numberOfColums = value[0].length
          if (value.some((row) => row.length !== numberOfColums)) {
            return false
          }

          return value.every(
            (row) =>
              Array.isArray(row) &&
              row.every((item) => {
                const [type, property] = item.split('_').reverse()

                if (
                  !rawAstralObjectsKeys.includes(type as RawAstralObjectType)
                ) {
                  return false
                }

                const validProperties =
                  astralObjectPropertyValidation[type as RawAstralObjectType]
                if (validProperties && !validProperties.includes(property)) {
                  return false
                }

                return true
              })
          )
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must be a 2D array of RawAstralObjectType values with rows with the same length`
        },
      },
    })
  }
}
