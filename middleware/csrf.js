module.exports = function csrf(req, res, next) {
    // CSRF check
    if (!req.headers['x-xsrf-token'] || req.headers['x-xsrf-token'] !== req.cookies['XSRF-TOKEN']) {
        return res.status(401).json({
            message: 'CRSF'
        });
    }
    next();
};
