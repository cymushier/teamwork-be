const pool = require('./pool-manager');

/**
 * Execute raw SQL query against the database and return raw result object.
 * @param query The raw query string.
 * @param callback The callback to called with the results.
 * @param params Any parameters to pass to the query.
 * @example 
 * const modelBase = require('./models/base-model');
 * modelBase.execute('SELECT 1 AS col', (result) => {
 *   console.log(`Rows: ${result.rows}`);
 *   console.log(`Rows Count: ${result.rowCount}`);
 * });
 * 
 * @returns QueryArrayResult<any[]>
 */
exports.execute = (query, callback, params = []) => {
  pool.connect((err, client, done) => {
    if (err) {
      console.log(`Could not establish connection to database: ${err}`);
      throw new Error('Connection error');
    }

    client.query(query, params, (clientError, result) => {
      // Calling done to free the client back to the pool
      done();
      if (clientError) {
        console.log(`Query execution error: ${clientError}`);
        throw new Error(clientError);
      }
      callback(result);
    });
  });
};
