const { sanitizeInput, sendResponse, handleCors } = require('./config.js');

/**
 * Mojang API Proxy - Get player UUID
 * GET /api/mojang?username=USERNAME
 */
module.exports = async (req, res) => {
    // Handle CORS preflight
    if (handleCors(req, res)) return;

    // Validate request method
    if (req.method !== 'GET') {
        return sendResponse(res, { error: 'Method not allowed' }, 405);
    }

    // Get and validate username
    const username = req.query.username ? sanitizeInput(req.query.username) : '';

    if (!username) {
        return sendResponse(res, { error: 'Username is required' }, 400);
    }

    try {
        const response = await fetch(
            `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`,
            {
                headers: { 'Accept': 'application/json' }
            }
        );

        if (response.ok) {
            const data = await response.json();
            if (data && data.id) {
                return sendResponse(res, data, 200);
            }
        }

        return sendResponse(res, { error: 'Player not found', name: username }, 404);
    } catch (error) {
        return sendResponse(res, { error: 'Failed to fetch player data' }, 500);
    }
};
