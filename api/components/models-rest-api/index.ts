import { DbSubtitle } from '../../models/Subtitle'
import { DbUser } from '../../models/User'
import { app } from '../../app'
import {
    exportPublicModel,
    requestParamsToQuery,
    APIError,
    checkForbiddenMethodsMiddleware
} from './utils'
import { BaseModel } from '../../models/BaseModel'

export function initialize() {
    const models: Array<typeof BaseModel> = [DbSubtitle, DbUser]

    app.router.use('/api/resources/:modelName', async (ctx, next) => {
        const model = models.find(
            model => model.tableName === ctx.params.modelName
        )

        if (!model) {
            ctx.body = {
                status: 400,
                error: 'Invalid model name specified'
            }
        } else {
            ctx.state.model = model

            try {
                await next()
            } catch (e) {
                console.log(e)

                ctx.body = {
                    status: e instanceof APIError ? e.code : 500,
                    error:
                        e instanceof APIError
                            ? e.message
                            : 'An internal error occured'
                }
            }

            if (ctx.body.status) ctx.status = ctx.body.status
        }
    })

    app.router.get(
        '/api/resources/:modelName',
        checkForbiddenMethodsMiddleware('list'),
        async ctx => {
            const model: typeof BaseModel = ctx.state.model

            const options = requestParamsToQuery(ctx.request.query)

            const instances = await model.findAll(options)
            const total = await model.count(options)

            ctx.body = {
                status: 200,
                total,
                data: exportPublicModel(model, instances, ctx.state.user)
            }
        }
    )
}
