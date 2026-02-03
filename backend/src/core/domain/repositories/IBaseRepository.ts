/**
 * Base Repository Interface
 * Defines common CRUD operations that all repositories should implement
 */
export interface IBaseRepository<T> {
    /**
     * Find entity by ID
     */
    findById(id: string): Promise<T | null>;

    /**
     * Find all entities matching a filter
     */
    findAll(filter?: any): Promise<T[]>;

    /**
     * Find one entity matching a filter
     */
    findOne(filter: any): Promise<T | null>;

    /**
     * Count documents matching a filter
     */
    count(filter?: any): Promise<number>;

    /**
     * Delete entity by ID
     */
    delete(id: string): Promise<void>;

    /**
     * Delete multiple entities matching a filter
     */
    deleteMany(filter: any): Promise<number>;

    /**
     * Check if entity exists
     */
    exists(filter: any): Promise<boolean>;
}
