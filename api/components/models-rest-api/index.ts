import { handleRequest } from './request-handler'
import { DbSubtitle } from '../../models/Subtitle'
import { DbUser } from '../../models/User'
import { Model } from 'sequelize-typescript'

export function initialize() {
	const models: Array<typeof Model> = [DbSubtitle, DbUser]
}
