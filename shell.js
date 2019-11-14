const bcrypt = require('bcrypt');
const modelBase = require('./models/base-model');

const ALL_TABLES = ['users', 'posts', 'comments', 'tags', 'post_tags'];

const usersTableCreate = `
CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL, 
    last_name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    job_role VARCHAR(20) NOT NULL,
    password VARCHAR(128),
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    address TEXT,
    created_by_id INTEGER,
    FOREIGN KEY (created_by_id) REFERENCES users(id)
);
`;

const postsTableCreate = `
CREATE TABLE IF NOT EXISTS posts (
    id serial PRIMARY KEY,
    post_type VARCHAR(20) NOT NULL,
    url VARCHAR(250),
    title VARCHAR(250) NOT NULL,
    article TEXT,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER REFERENCES users (id) NOT NULL
);
`;

const commentsTableCreate = `
CREATE TABLE IF NOT EXISTS comments (
    id serial PRIMARY KEY,
    post_id INTEGER REFERENCES posts (id) NOT NULL,
    comment TEXT NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER REFERENCES users (id) NOT NULL,
    parent_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES comments(id)
);
`;

const tagsTableCreate = `
CREATE TABLE IF NOT EXISTS tags (
    tag VARCHAR PRIMARY KEY,
    description TEXT,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER REFERENCES users (id)
);
`;

const postTagsTableCreate = `
CREATE TABLE IF NOT EXISTS post_tags (
    post_id INTEGER REFERENCES posts (id),
    tag VARCHAR REFERENCES tags,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag)
);
`;


const createTables = () => {
    const allSchemas = [
        usersTableCreate, postsTableCreate,
        commentsTableCreate, tagsTableCreate,
        postTagsTableCreate].reduce((prev, curr, _ind, _arr) => {
            return prev + curr;
        }, '');
    // Error exceptions intentionally left to propagate
    modelBase.execute(allSchemas, (result) => {
        console.log(`Executed all schema creation successfully: ${result.rowCount}`);
        return;
    });
}

const dropTables = () => {
    // Error exceptions intentionally left to propagate
    modelBase.execute(`DROP TABLE IF EXISTS ${ALL_TABLES.join(',')} CASCADE;`, (result) => {
        console.log(`Executed all schema deletion successfully: ${result.rowCount}`);
        return;
    });
}

/**
 * To seed the default user (admin) required to login necessarily.
 */
const createDefaultUser = () => {
    const adminEmail = 'admin@example.com';
    const adminPass = 'pass123$';
    modelBase.execute(`SELECT COUNT(id) AS admins FROM users WHERE email=$1;`, (result) => {
        if (result.rows) {
            if (result.rows.length > 0 && result.rows[0].admins > 0) {
                console.log(`There already exists an admin user.`);
                return;
            }
        }
        // Time to create a new user. [admin@example.com, pass123$]
        bcrypt.hash(adminPass, 10).then(hash => {
            const createScript = `INSERT INTO users(email, first_name, last_name, job_role, password)
            VALUES('${adminEmail}', 'Admin', 'Default', 'admin', '${hash}');`;
            modelBase.execute(createScript, (result) => {
                console.log(`Successfully created default admin. Email: ${adminEmail} | Password: ${adminPass}`);
                return;
            });
        });
    }, [adminEmail]);
}

/**
 * To delete the default user (admin) required to login necessarily.
 */
const deleteDefaultUser = () => {
    const adminEmail = 'admin@example.com';
    modelBase.execute(`DELETE FROM users WHERE email=$1;`, (result) => {
        if (result.rowCount) {
            if (result.rowCount > 0) {
                console.log(`Successfully deleted default admin user.`);
                return;
            }
        }
        console.log(`Failed to delete the default admin user.`);
    }, [adminEmail]);
}

module.exports = { createTables, dropTables, createDefaultUser, deleteDefaultUser };

require('make-runnable');