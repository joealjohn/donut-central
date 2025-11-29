const { makeApiRequest, sanitizeInput, isValidUsername, sendResponse, handleCors } = require('./config.js');

/**
 * Player Stats Endpoint
 * GET /api/stats?user=USERNAME
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

    // Get and validate username
    const user = req.query.user ? sanitizeInput(req.query.user) : '';

    if (!user) {
        return sendResponse(res, {
            message: 'Username is required',
            reason: 'Missing Parameter',
            status: 400
        }, 400);
    }

    if (!isValidUsername(user)) {
        return sendResponse(res, {
            message: 'Invalid username format. Minecraft usernames can only contain letters, numbers, and underscores (1-16 characters).',
            reason: 'Invalid Parameter',
            status: 400
        }, 400);
    }

    // Make API request
    const result = await makeApiRequest(`/stats/${user}`);

    // Forward the response
    return sendResponse(res, result.data, result.status);
};
