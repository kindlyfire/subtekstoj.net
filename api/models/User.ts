import { Model, Table, Column, HasMany } from 'sequelize-typescript'
import { BaseModel } from './BaseModel'
import { DataTypes } from 'sequelize'
import { DbSubtitle } from './Subtitle'
import { APIModelSettings } from '../interfaces'

@Table({
    modelName: 'User',
    tableName: 'users'
})
export class DbUser extends BaseModel<DbUser> {
    @Column(DataTypes.STRING)
    public name!: string

    @Column(DataTypes.STRING)
    public email!: string

    @Column(DataTypes.STRING)
    public hashedPassword!: string

    // ASSOCIATIONS

    @HasMany(() => DbSubtitle)
    public subtitles!: DbSubtitle[]

    // API

    static get apiSettings(): APIModelSettings<DbUser> {
        return {
            disallowedRequests: ['list'],

            getAllowedProps(inst, user) {
                return ['name', 'email']
            }
        }
    }
}

export async function initialize() {
    const user = await DbUser.create({
        name: 'Tijl Van den Brugghen',
        email: `drop@tijlvdb.me`
    })

    DbSubtitle.create({
        fileName: 'test.rst',
        uploaderId: user.id
    })
}
