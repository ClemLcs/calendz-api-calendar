import { schema } from '@ioc:Adonis/Core/Validator'
import { rules } from "@adonisjs/validator/build/src/Rules";

export const RequireName = schema.create({
  firstname: schema.string([
    rules.required(),
    rules.maxLength(20)
  ]),
  lastname: schema.string([
    rules.required(),
    rules.maxLength(20)
  ]),
  ignoreCache: schema.boolean.optional()
})
