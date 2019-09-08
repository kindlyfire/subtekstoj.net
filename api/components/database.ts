import { Sequelize } from 'sequelize-typescript'
import { app } from '../app'
import cuid from 'cuid'

/**
 * Load the database and set it on the app instance. Also adds the hooks for the
 * creation of resource identifiers.
 */
export async function beforeInitialize() {
    if (!app.config.DB_URI) throw Error('No database to connect to')

    app.sequelize = new Sequelize(app.config.DB_URI)

    // These hooks assign identifiers to new database entries
    app.sequelize.addHook('beforeCreate', instance => {
        let i: {
            id?: string
        } = instance as any

        if (!i.id) {
            i.id = cuid()
        }
    })
    app.sequelize.addHook('beforeBulkCreate', instances => {
        let is: Array<{
            id?: string
        }> = instances as any

        for (let i of is) {
            if (!i.id) {
                i.id = cuid()
            }
        }
    })

    await app.sequelize.authenticate()
}

export async function afterInitialize() {
    await app.sequelize.sync({ force: true })
}
