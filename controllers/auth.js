const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    }).catch(error => {
        console.log(`Bcyrpt Exception: ${error}`);
        res.status(500).json({
            status: "failed",
            data: {
                message: "Internal server error"
            }
        });
    });
};

exports.login = (req, res) => {
    try {
        const email = req.body.email;
        execute(`SELECT id, password, job_role, first_name, last_name, created_on FROM users WHERE email=$1 LIMIT 1;`, (result) => {
            if (result.rows) {
                if (result.rows.length > 0) {
                    const userModel = result.rows[0];
                    if (userModel) {
                        bcrypt.compare(req.body.password, userModel.password).then(valid => {
                            if (valid) {
                                const tokenPayload = {
                                    userId: userModel.id,
                                    jobRole: userModel.job_role,
                                    firstName: userModel.first_name,
                                    lastName: userModel.last_name
                                };
                                const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET, { expiresIn: '4h' });

                                res.status(200).json({
                                    status: "success",
                                    data: {
                                        message: "Successfully logged in user",
                                        userId: userModel.id,
                                        token: token,
                                        jobRole: userModel.job_role,
                                        firstName: userModel.first_name,
                                        lastName: userModel.last_name,
                                        createdOn: userModel.created_on
                                    }
                                });
                                return;
                            } else {
                                res.status(401).json({
                                    status: "failed",
                                    data: {
                                        message: "Invalid login attempt. Try again."
                                    }
                                });
                            }
                        }).catch(error => {
                            console.log(error);
                            res.status(500).json({
                                status: "failed",
                                data: {
                                    message: "Could not successfully login user. Try again."
                                }
                            });
                        });
                    } else {
                        res.status(401).json({
                            status: "failed",
                            data: {
                                message: "Invalid login attempt. Try again."
                            }
                        });
                    }
                } else {
                    res.status(401).json({
                        status: "failed",
                        data: {
                            message: "Invalid login attempt. Try again."
                        }
                    });
                }
            } else {
                res.status(401).json({
                    status: "failed",
                    data: {
                        message: "Invalid login attempt. Try again."
                    }
                });
            }
        }, [email]);
    } catch (error) {
        console.log(`Login Error: ${error}`);
        res.status(500).json({
            status: "failed",
            data: {
                message: "Internal Server Error. Try again."
            }
        });
    }
}
