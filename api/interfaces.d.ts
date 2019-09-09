import { DbUser } from './models/User'

export interface Config {
    DB_URI: string
    PORT: string
}

type APIRequestType = 'list' | 'create' | 'read' | 'update' | 'delete'

interface APIModelSettings<T> {
    disallowedRequests: APIRequestType[]

    getAllowedProps(
        inst: T,
        user: DbUser | undefined,
        isDeep: boolean
    ): string[] | true
}
