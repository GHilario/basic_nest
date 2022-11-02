module.exports = {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
        migrationsDir: 'src/migrations'
    }
  }