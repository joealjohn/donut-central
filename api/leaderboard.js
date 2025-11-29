const { makeApiRequest, sanitizeInput, validatePage, sendResponse, handleCors } = require('./config.js');

/**
 * Leaderboard Endpoint
 * GET /api/leaderboard?type=TYPE&page=PAGE
 */
module.exports = async (req, res) => {
    // Handle CORS preflight
    if (handleCors(req, res)) return;

    // Validate request method
    if (req.method !== 'GET') {
        return sendResponse(res, {
            message: 'Method not allowed',
            reason: 'Invalid Request',
            status: 405
        }, 405);
    }

    // Valid leaderboard types
    const validTypes = [
        'money', 'kills', 'deaths', 'playtime', 'shards',
        'brokenblocks', 'placedblocks', 'mobskilled', 'sell', 'shop'
    ];

    // Get and validate type
    const type = req.query.type ? sanitizeInput(req.query.type).toLowerCase() : '';

    if (!type) {
        return sendResponse(res, {
            message: 'Leaderboard type is required',
            reason: 'Missing Parameter',
            status: 400
        }, 400);
    }

    if (!validTypes.includes(type)) {
        return sendResponse(res, {
            message: 'Invalid leaderboard type. Valid types: ' + validTypes.join(', '),
            reason: 'Invalid Parameter',
            status: 400
        }, 400);
    }

    // Get and validate page
    const page = validatePage(req.query.page, 1, 0);

    // Make API request
    const result = await makeApiRequest(`/leaderboards/${type}/${page}`);

    // Forward the response
    return sendResponse(res, result.data, result.status);
};
