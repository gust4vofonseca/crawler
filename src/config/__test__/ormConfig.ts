export const ormConfig = [
  {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: process.env.POSTGRESQL_PORT,
    username: 'postgres',
    password: process.env.POSTGRESQL_PASSWORD,
    database: 'precato_test',
    synchronize: false,
    logging: false,
    migrationsTableName: 'migration',
    entities:
      process.env.NODE_ENV === 'dev'
        ? ['src/modules/**/infra/typeorm/entities/*.ts']
        : ['dist/modules/**/infra/typeorm/entities/*.js'],
    migrations:
      process.env.NODE_ENV === 'dev'
        ? ['src/shared/infra/typeorm/migrations/*.ts']
        : ['dist/shared/infra/typeorm/migrations/*.js'],
    cli: {
      entitiesDir: 'src/modules/**/infra/typeorm/entities',
      migrationsDir: 'src/shared/infra/typeorm/migrations',
    },
  },
];
