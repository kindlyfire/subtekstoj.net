import { DbUser } from './models/User'

export interface Config {
    DB_URI: string
    PORT: string
}

type APIRequestType = 'list' | 'create' | 'read' | 'update' | 'delete'

interface APIModelSettings<T> {
    disallowedRequests: APIRequestType[]

    /**
     * Get all props a user is allowed to *see* (returned from the API)
     */
    getAllowedProps?(
        inst: T,
        user: DbUser | undefined,
        isDeep: boolean
    ): string[] | true

    /**
     * Get all props a user is allowed to edit
     */
    getEditableProps?(inst: T, user: DbUser | undefined): string[] | true
}
