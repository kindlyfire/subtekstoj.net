import { BaseModel } from '../../models/BaseModel'
import { DbUser } from '../../models/User'

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
        let props = ctor.apiSettings.getAllowedProps(model, user)

        if (props === true) props = Object.keys(model.get())

        props = ['id', 'createdAt', 'updatedAt', ...props]

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

// @TODO
function isModels(obj: any) {
    return false
}
