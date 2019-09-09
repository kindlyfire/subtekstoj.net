import { Model, Table, Column, HasMany } from 'sequelize-typescript'
import { BaseModel } from './BaseModel'
import { DataTypes } from 'sequelize'
import { DbSubtitle } from './Subtitle'
import { ApiModelSettings } from '../interfaces'

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

    static apiSettings: ApiModelSettings<DbUser> = {
        getAllowedProps(inst, user) {
            return ['name', 'email']
        }
    }
}

export function initialize() {
    DbUser.create({
        name: 'Tijl Van den Brugghen',
        email: `drop@tijlvdb.me`
    })
}
