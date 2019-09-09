import { BaseModel } from '../../models/BaseModel'
import { DbUser } from '../../models/User'
import { FindOptions } from 'sequelize'

/**
 * Create an array of object from a model or an array of models. Will only
 * contain values the user can access. Automatically exports associations as
 * well.
 */
export function exportPublicModel(
    ctor: typeof BaseModel,
    models: BaseModel<any> | BaseModel<any>[],
    user?: DbUser
) {
    if (!Array.isArray(models)) {
        models = [models]
    }

    let res: any[] = []

    for (let model of models) {
        const raw = model.get()
        let props = ctor.apiSettings.getAllowedProps(model, user)

        if (props === true) props = Object.keys(raw)

        props = ['id', 'createdAt', 'updatedAt', ...props].filter(
            prop => prop in raw
        )

        let obj: any = {}

        for (let prop of props) {
            if (isModels(model[prop])) {
                obj[prop] = exportPublicModel(
                    (model[prop] as any).constructor,
                    model[prop],
                    user
                )
            } else {
                obj[prop] = model[prop]
            }
        }

        res.push(obj)
    }

    return res
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

    if (query.limit) {
        let limit = parseInt(query.limit)

        if (!limit || limit < 0) limit = 10
        if (limit > 100) limit = 100

        options.limit = limit
    }

    if (query.offset) {
        let offset = parseInt(query.offset)

        if (!offset || offset < 0) offset = 0

        options.offset = offset
    }

    if (query.order) {
        let parts = query.order.split(',')

        if (!['ASC', 'DESC'].includes((parts[1] + '').toUpperCase()))
            parts[1] = 'DESC'

        options.order = [[parts[0], parts[1].toUpperCase()]]
    }

    return options
}
