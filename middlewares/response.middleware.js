export const ResponseHandler = (req, res, next) => {
    res.success = (code, message, data, paging) => {
        const response = {
            success: true,
            code,
            message,
            paging,
            data: data || null,
        };
        return res.status(code).json(response);
    };
    res.error = (code, message, data) => {
        const response = {
            success: false,
            code,
            message,
            data,
        };
        return res.status(code).json(response);
    };
    next();
};
