const pool = require('./pool-manager');

pool.connect((err, client, done) => {
    if (err) {
        console.log(`Could not establish connection to database: ${err}`);
        throw new Error('Connection error');
    }

    client.query(`SELECT 1 AS col`, (clientError, result) => {
        // Calling done to free the client back to the pool
        done();
        if (clientError) {
            console.log(`Query execution error: ${clientError}`);
            throw new Error(clientError);
        }
        console.log(result.rows);
    });
});