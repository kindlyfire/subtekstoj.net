import {
    CreatedAt,
    UpdatedAt,
    Column,
    PrimaryKey,
    Model
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

/**
 * Base model containing attributes common between all resources
 */
export class BaseModel<T> extends Model<T> {
    @PrimaryKey
    @Column(DataTypes.STRING(25))
    public id!: string

    @CreatedAt
    @Column
    public readonly createdAt!: Date

    @UpdatedAt
    @Column
    public readonly updatedAt!: Date
}
