import Joi from 'joi'

export const GetResourcesWithPaginationSchema = Joi.object({
  page: Joi.number().min(1).required(),
  limit: Joi.number().min(1).required(),
  searchQuery: Joi.string()
})
