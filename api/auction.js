const { makeApiRequest, sanitizeInput, validatePage, sendResponse, handleCors } = require('./config.js');

/**
 * Auction House Endpoint
 * GET /api/auction?page=PAGE&search=QUERY&sort=SORT
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

    // Valid sort options
    const validSorts = ['lowest_price', 'highest_price', 'recently_listed', 'last_listed'];

    // Get and validate parameters
    const page = validatePage(req.query.page, 1, 0);
    const search = req.query.search ? sanitizeInput(req.query.search) : '';
    const sort = req.query.sort ? sanitizeInput(req.query.sort).toLowerCase() : '';

    // Build request body for search/sort
    let body = null;
    if (search || sort) {
        body = {};
        if (search) body.search = search;
        if (sort) {
            if (!validSorts.includes(sort)) {
                return sendResponse(res, {
                    message: 'Invalid sort option. Valid options: ' + validSorts.join(', '),
                    reason: 'Invalid Parameter',
                    status: 400
                }, 400);
            }
            body.sort = sort;
        }
    }

    // Make API request
    const url = `/auction/list/${page}`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.DONUT_API_KEY || 'bbcc8b4cc6654f35bd0fc3a1878658cc'}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            signal: controller.signal
        };

        // Add body for search/sort
        if (body) {
            fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(`https://api.donutsmp.net/v1${url}`, fetchOptions);
        clearTimeout(timeoutId);
        
        const data = await response.json();
        return sendResponse(res, data, response.status);
    } catch (error) {
        return sendResponse(res, {
            message: 'Request failed: ' + error.message,
            reason: 'Connection Error',
            status: 500
        }, 500);
    }
};
