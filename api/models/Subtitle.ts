import { Column, Table } from 'sequelize-typescript'
import { BaseModel } from './BaseModel'
import { app } from '../app'
import { DataTypes } from 'sequelize'

@Table({
    modelName: 'Subtitle',
    tableName: 'subtitles'
})
export class DbSubtitle extends BaseModel<DbSubtitle> {
    @Column(DataTypes.STRING)
    public fileName!: string

    @Column(DataTypes.STRING)
    public fileHash!: string
}

export function initialize() {
    app.sequelize.addModels([DbSubtitle])
}
