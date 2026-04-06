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
        // Guard: error.errors hanya ada jika ini ZodError
        const errors = Array.isArray(error.errors)
            ? error.errors.map(err => ({
                field: err.path.slice(1).join('.'),
                message: err.message
            }))
            : [{ field: 'unknown', message: error.message || 'Validasi gagal' }];

        return res.status(400).json({
            message: "Data input tidak valid!",
            errors
        });
    }
};

module.exports = validate;
