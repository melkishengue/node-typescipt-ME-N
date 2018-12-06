export interface IDatabaseConfiguration {
  host: string | undefined,
  port: string | undefined,
  username: string | undefined,
  password: string | undefined,
  database: string | undefined
}

export interface IDatabaseProvider {
  // configure(databaseConfiguration: DatabaseConfiguration): void;
  // this function should return an object of type connection. But which one ?
  // getConnection(): any;
}