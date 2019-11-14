const pool = require('./pool-manager');

/**
 * Execute raw `SQL` query against the database and return raw result object.
 * @param query The raw query string.
 * @param callback The callback to called with the results.
 * @param params Any parameters to pass to the query.
 * @example 
 * const { execute } = require('./models/base-model');
 * execute('SELECT 1 AS col', (result) => {
 *   console.log(`Rows: ${result.rows}`);
 *   console.log(`Rows Count: ${result.rowCount}`);
 * });
 * 
 * @returns QueryArrayResult<any[]>
 */
const execute = (query, callback, params = []) => {
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

/**
 * Executes INSERT into the given table and passes `true`/`false` for success/failure of the query.
 * @param table The table to insert into.
 * @param columns The list of columns as we are affecting them.
 * @param values The list of values as we affecting them.
 * @param callback The function to be executed when results are retrieved.
 */
const executeInsert = (table, columns, values, callback) => {
  const createScript = `INSERT INTO ${table}(${columns.join(',')}) VALUES(${values.map((_val, index, _arr) => `$${index + 1}`)});`;
  execute(createScript, (result) => {
    if (result.rowCount) {
      if (result.rowCount > 0) {
        callback(true);
        return;
      }
    }
    callback(false);
  }, values);
};

module.exports = { execute, executeInsert };
