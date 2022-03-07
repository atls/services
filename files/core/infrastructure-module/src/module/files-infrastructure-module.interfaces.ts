export interface FilesInfrastructureDbOptions {
  port?: number
  host?: string
  database?: string
  username?: string
  password?: string
}

export interface FilesInfrastructureOptions {
  db?: FilesInfrastructureDbOptions
}
