import { BaseModel } from '../../models/BaseModel'
import { DbUser } from '../../models/User'
import { FindOptions } from 'sequelize'
import { Middleware } from 'koa-compose'
import { APIRequestType } from '../../interfaces'

/**
 * Create an array of object from a model or an array of models. Will only
 * contain values the user can access. Automatically exports associations as
 * well.
 */
export function exportPublicModel(
    ctor: typeof BaseModel,
    models: BaseModel<any> | BaseModel<any>[],
    user?: DbUser,
    isDeep = false
) {
    if (!Array.isArray(models)) {
        models = [models]
    }

    let res: any[] = []

    for (let model of models) {
        let obj: any = {}

        for (let prop of getAllowedProps(ctor, model, user, isDeep)) {
            if (isModels(model[prop])) {
                obj[prop] = exportPublicModel(
                    (model[prop] as any).constructor,
                    model[prop],
                    user,
                    true
                )
            } else {
                obj[prop] = model[prop]
            }
        }

        res.push(obj)
    }

    return res
}

function getAllowedProps(
    ctor: typeof BaseModel,
    model: BaseModel<any>,
    user?: DbUser,
    isDeep = false
) {
    const raw = model.get()
    let props = ctor.apiSettings.getAllowedProps
        ? ctor.apiSettings.getAllowedProps(model, user, isDeep)
        : true

    if (props === true) props = Object.keys(raw)

    props = ['id', 'createdAt', 'updatedAt', ...props].filter(
        prop => prop in raw
    )

    return props
}

/**
 * Check if `obj` is a model or an array of models.
 *
 * @todo
 */
function isModels(obj: any) {
    return false
}

/**
 * Transform an HTTP query into a FindOptions object that can be passed to the
 * BaseModel#findAll() method.
 */
export function requestParamsToQuery(query: any): FindOptions {
    const options: FindOptions = {}

    options.limit = parseRequestLimit(query.limit)
    options.offset = parseRequestOffset(query.offset)
    query.order = parseRequestOrder(query.order)

    return options
}

function parseRequestLimit(str: string) {
    let limit = parseInt(str)

    if (!limit || limit < 0) limit = 10
    if (limit > 100) limit = 100

    return limit
}

function parseRequestOffset(str: string) {
    let offset = parseInt(str)

    if (!offset || offset < 0) offset = 0

    return offset
}

function parseRequestOrder(str: string) {
    if (!str) return ['id', 'ASC']

    let parts = str.split(',')

    if (!['ASC', 'DESC'].includes((parts[1] + '').toUpperCase()))
        parts[1] = 'DESC'

    return [[parts[0], parts[1].toUpperCase()]]
}

export class APIError extends Error {
    isAPIError = true
    code: number

    constructor(msg, code = 500) {
        super(msg)

        this.code = code
    }
}

/**
 * Middleware generator to check that a certain API request type has not been
 * blocked on a model.
 */
export function checkForbiddenMethodsMiddleware(
    type: APIRequestType
): Middleware<any> {
    return (ctx, next) => {
        const model: typeof BaseModel = ctx.state.model

        if (model.apiSettings.disallowedRequests.includes(type))
            throw new APIError('Request type is disallowed.', 403)

        return next()
    }
}

/**
 * Deletes potentially sensitive information from a Sequelize error array
 */
export function exportPublicSequelizeErrors(errors: any) {
    for (let err of errors) {
        delete err.instance
        delete err.original
    }

    return errors
}

/**
 * Transforms an error object into an object that can be returned by the API
 */
export function errorToBody(e: any) {
    if (e instanceof APIError) {
        return {
            status: e.code,
            error: e.message
        }
    } else if (Array.isArray(e.errors)) {
        return {
            status: 400,
            error: 'Resource validation failed',
            details: exportPublicSequelizeErrors(e.errors)
        }
    } else {
        return {
            status: 500,
            error: 'An internal error occured'
        }
    }
}
