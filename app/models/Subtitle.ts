import { Column, Table, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { BaseModel } from './BaseModel'
import { app } from '../app'
import { DataTypes } from 'sequelize'
import { DbUser } from './User'
import { APIModelSettings } from '../interfaces'

@Table({
    modelName: 'Subtitle',
    tableName: 'subtitles'
})
export class DbSubtitle extends BaseModel<DbSubtitle> {
    @Column({
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
            len: [7, 64]
        }
    })
    public fileName!: string

    @Column({
        type: DataTypes.STRING,
        allowNull: false
    })
    public fileHash!: string

    @Column
    public downloads!: number

    // ASSOCIATIONS

    @ForeignKey(() => DbUser)
    @Column(DataTypes.STRING(25))
    public uploaderId!: string

    @BelongsTo(() => DbUser)
    public uploader!: DbUser

    // API

    static get apiSettings(): APIModelSettings<DbSubtitle> {
        return {
            disallowedRequests: [],

            getAllowedProps(inst, user) {
                return true
            }
        }
    }
}
