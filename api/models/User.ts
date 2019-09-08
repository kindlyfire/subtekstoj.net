import { Model, Table } from 'sequelize-typescript'
import { BaseModel } from './BaseModel'
import { app } from '../app'

@Table({
    modelName: 'User',
    tableName: 'users'
})
export class DbUser extends BaseModel<DbUser> {}

export function initialize() {
    app.sequelize.addModels([DbUser])
}
