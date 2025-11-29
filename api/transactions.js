const { makeApiRequest, validatePage, sendResponse, handleCors } = require('./config.js');

/**
 * Auction Transactions Endpoint
 * GET /api/transactions?page=PAGE
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

    // Get and validate page (1-10 for transactions)
    const page = validatePage(req.query.page, 1, 10);

    // Make API request
    const result = await makeApiRequest(`/auction/transactions/${page}`);

    // Forward the response
    return sendResponse(res, result.data, result.status);
};
