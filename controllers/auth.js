const bcrypt = require('bcrypt');
const { executeInsert, execute } = require('../models/base-model');

exports.createUser = (req, res) => {
    bcrypt.hash(req.body.password, 10).then(passwordHash => {
        try {
            const { email, firstName, lastName, department, jobRole, address, userId } = req.body;
            if (!email || !firstName || !lastName || !jobRole) {
                res.status(400).json({
                    status: "failed",
                    data: {
                        message: "Mising required parameters. Try again."
                    }
                });
                return;
            }
            execute(`SELECT COUNT(id) AS others FROM users WHERE email=$1;`, (result) => {
                if (result.rows) {
                    if (result.rows.length > 0 && result.rows[0].others > 0) {
                        res.status(400).json({
                            status: "failed",
                            data: {
                                message: "Email address already exist. Try again."
                            }
                        });
                        return;
                    }
                }

                // We can now INSERT
                executeInsert(
                    "users", ["email", "first_name", "last_name", "department", "job_role", "password", "address", "created_by_id"],
                    [email, firstName, lastName, department, jobRole, passwordHash, address, userId], (result) => {
                        if (result) {
                            res.status(201).json({
                                status: "success",
                                data: {
                                    message: "User account successfully created",
                                    userId: ""
                                }
                            });
                        } else {
                            res.status(400).json({
                                status: "failed",
                                data: {
                                    message: "Could not successfully create user. Try again."
                                }
                            });
                        }
                    });
            }, [email]);
        } catch (error) {
            res.status(500).json({
                status: "failed",
                data: {
                    message: "Could not successfully create user"
                }
            });
        }
    }
    );
};
