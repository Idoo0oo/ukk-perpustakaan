/**
 * Middleware Validasi Generic menggunakan Zod.
 * Digunakan untuk memvalidasi req.body, req.query, atau req.params sesuai Skema (Schema).
 */

const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (error) {
        return res.status(400).json({
            message: "Data input tidak valid!",
            errors: error.errors.map(err => ({
                field: err.path.slice(1).join('.'), // Menghilangkan kata 'body'/'query' dari nama field
                message: err.message
            }))
        });
    }
};

module.exports = validate;
