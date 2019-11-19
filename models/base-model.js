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
 * @param returnFields The fields we want to return after the row has been inserted.
 * If provided, these fields will be returned to the callback function as an object.
 */
const executeInsert = (table, columns, values, callback, returnFields = []) => {
  let createScript = `INSERT INTO ${table}(${columns.join(',')}) VALUES(${values.map((_val, index, _arr) => `$${index + 1}`)})`;
  let returns = '';
  if (returnFields && returnFields.length > 0) {
    returns += `RETURNING ${returnFields.join(',')}`;
  }
  createScript += ` ${returns};`;

  execute(createScript, (result) => {
    if (returns !== '') {
      if (result.rows) {
        if (result.rows.length > 0 && result.rows[0]) {
          callback(result.rows[0]);
          return;
        }
      }
    } else {
      if (result.rowCount) {
        if (result.rowCount > 0) {
          callback(true);
          return;
        }
      }
    }
    callback(false);
  }, values);
};

module.exports = { execute, executeInsert };
