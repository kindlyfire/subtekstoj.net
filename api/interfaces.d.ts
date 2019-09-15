import { DbUser } from './models/User'

// Configuration as returned by dotenv. dotenv only returns strings.
export interface Config {
    // Dtabase URI for access to MySQL
    DB_URI: string

    // Port the web server will listen on
    PORT: string
}

// Type of requests that exist for resources/models (like DbUser, DbSubtitle)
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
