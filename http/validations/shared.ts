import Joi from 'joi'

export const ResourceFetchSchema = Joi.object({
  page: Joi.number().required().min(1),
  limit: Joi.number().required(),
  searchQuery: Joi.string()
})
