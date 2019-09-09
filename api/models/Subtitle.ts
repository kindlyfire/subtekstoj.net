import { Column, Table, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { BaseModel } from './BaseModel'
import { app } from '../app'
import { DataTypes } from 'sequelize'
import { DbUser } from './User'
import { ApiModelSettings } from '../interfaces'

@Table({
    modelName: 'Subtitle',
    tableName: 'subtitles'
})
export class DbSubtitle extends BaseModel<DbSubtitle> {
    @Column(DataTypes.STRING)
    public fileName!: string

    @Column(DataTypes.STRING)
    public fileHash!: string

    // ASSOCIATIONS

    @ForeignKey(() => DbUser)
    @Column(DataTypes.STRING(25))
    public uploaderId!: string

    @BelongsTo(() => DbUser)
    public uploader!: DbUser

    static apiSettings: ApiModelSettings<DbSubtitle> = {
        getAllowedProps(inst, user) {
            return true
        }
    }
}
