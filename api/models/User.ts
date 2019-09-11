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
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 32]
        }
    })
    public name!: string

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    })
    public email!: string

    @Column({
        type: DataTypes.STRING(60),
        allowNull: false
    })
    public hashedPassword!: string

    // ASSOCIATIONS

    @HasMany(() => DbSubtitle)
    public subtitles!: DbSubtitle[]

    // API

    static get apiSettings(): APIModelSettings<DbUser> {
        return {
            disallowedRequests: ['list', 'delete'],

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
        fileName: 'tttttttttttttt',
        fileHash: 'Mé go!',
        uploaderId: user.id
    })
}
