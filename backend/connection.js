const {Client} =require('pg')

const connection= new Client ({
    host: '127.0.0.1',
    user: 'postgres',
    port:5432,
    password:'123',
    database: 'smms'
})
module.exports = connection;
