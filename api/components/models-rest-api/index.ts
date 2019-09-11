import { DbSubtitle } from '../../models/Subtitle'
import { DbUser } from '../../models/User'
import { app } from '../../app'
import {
    exportPublicModel,
    requestParamsToQuery,
    APIError,
    checkForbiddenMethodsMiddleware,
    exportPublicSequelizeErrors
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

                if (e instanceof APIError) {
                    ctx.body = {
                        status: e.code,
                        error: e.message
                    }
                } else if (Array.isArray(e.errors)) {
                    ctx.body = {
                        status: 400,
                        error: 'Resource validation failed',
                        details: exportPublicSequelizeErrors(e.errors)
                    }
                } else {
                    ctx.body = {
                        status: 500,
                        error: 'An internal error occured'
                    }
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

    app.router.post(
        '/api/resources/:modelName',
        checkForbiddenMethodsMiddleware('create'),
        async ctx => {
            const model: typeof BaseModel = ctx.state.model
            const data = ctx.request.body

            const instance = await model.create(data)

            ctx.body = {
                status: 200,
                data: instance
            }
        }
    )
}
