import { app } from '../app'

export function initialize() {
    app.router.get('/', async ctx => {
        return ctx.render('pages/index')
    })
}
