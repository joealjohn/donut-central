const { sanitizeInput, validatePage, sendResponse, handleCors, API_KEY } = require('./config.js');

// In-memory cache for Vercel (resets on cold start, but persists across requests)
let pricesCache = null;
let cacheTime = 0;
const CACHE_DURATION = 300000; // 5 minutes in ms

/**
 * Prices Endpoint with Caching
 * GET /api/prices?page=PAGE&search=SEARCH&sort=SORT
 */
module.exports = async (req, res) => {
    // Handle CORS preflight
    if (handleCors(req, res)) return;

    // Validate request method
    if (req.method !== 'GET') {
        return sendResponse(res, { message: 'Method not allowed', status: 405 }, 405);
    }

    const page = validatePage(req.query.page, 1, 0);
    const search = req.query.search ? sanitizeInput(req.query.search).toLowerCase() : '';
    const sort = req.query.sort ? sanitizeInput(req.query.sort).toLowerCase() : 'price_desc';
    const itemsPerPage = 30;

    let items = [];
    let totalListingsScanned = 0;
    let uniqueItemsCount = 0;

    // Check cache
    const now = Date.now();
    if (pricesCache && (now - cacheTime) < CACHE_DURATION) {
        items = pricesCache.items;
        totalListingsScanned = pricesCache.total_listings;
        uniqueItemsCount = items.length;
    } else {
        // Fetch fresh data
        try {
            const allItems = [];
            const pagesToFetch = 25;
            
            // Fetch pages in parallel (batches of 5)
            for (let batch = 0; batch < 5; batch++) {
                const promises = [];
                for (let i = 1; i <= 5; i++) {
                    const pageNum = batch * 5 + i;
                    if (pageNum <= pagesToFetch) {
                        promises.push(
                            fetch(`https://api.donutsmp.net/v1/auction/list/${pageNum}`, {
                                headers: {
                                    'Authorization': `Bearer ${API_KEY}`,
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                }
                            }).then(r => r.ok ? r.json() : null).catch(() => null)
                        );
                    }
                }
                
                const results = await Promise.all(promises);
                for (const data of results) {
                    if (data && data.result && Array.isArray(data.result)) {
                        allItems.push(...data.result);
                    }
                }
            }

            totalListingsScanned = allItems.length;
            const priceData = {};

            for (const listing of allItems) {
                if (!listing.item?.id || !listing.price) continue;
                
                const itemId = listing.item.id;
                const count = Math.max(1, listing.item.count || 1);
                const pricePerItem = listing.price / count;
                
                let itemName = itemId.replace('minecraft:', '').replace(/_/g, ' ');
                itemName = itemName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                if (!priceData[itemId]) {
                    priceData[itemId] = { id: itemId, name: itemName, prices: [], listings: 0 };
                }
                priceData[itemId].prices.push(pricePerItem);
                priceData[itemId].listings++;
            }

            items = [];
            for (const [itemId, data] of Object.entries(priceData)) {
                if (data.prices.length === 0) continue;
                const prices = data.prices.sort((a, b) => a - b);
                items.push({
                    id: data.id,
                    name: data.name,
                    avg_price: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
                    min_price: Math.round(Math.min(...prices)),
                    max_price: Math.round(Math.max(...prices)),
                    listings: data.listings,
                    median_price: Math.round(prices[Math.floor(prices.length / 2)])
                });
            }

            uniqueItemsCount = items.length;

            // Update cache
            pricesCache = { items, total_listings: totalListingsScanned };
            cacheTime = now;
        } catch (error) {
            return sendResponse(res, { message: 'Failed to fetch prices', error: error.message }, 500);
        }
    }

    // Filter by search
    let filteredItems = items;
    if (search) {
        filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(search) ||
            item.id.toLowerCase().includes(search)
        );
    }

    // Sort
    switch (sort) {
        case 'price_asc':
            filteredItems.sort((a, b) => a.avg_price - b.avg_price);
            break;
        case 'price_desc':
            filteredItems.sort((a, b) => b.avg_price - a.avg_price);
            break;
        case 'name_asc':
            filteredItems.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name_desc':
            filteredItems.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'listings':
            filteredItems.sort((a, b) => b.listings - a.listings);
            break;
        default:
            filteredItems.sort((a, b) => b.avg_price - a.avg_price);
    }

    // Paginate
    const totalItems = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const offset = (page - 1) * itemsPerPage;
    const pagedItems = filteredItems.slice(offset, offset + itemsPerPage);

    return sendResponse(res, {
        status: 200,
        result: pagedItems,
        pagination: {
            page,
            per_page: itemsPerPage,
            total_items: totalItems,
            total_pages: totalPages
        },
        meta: {
            total_listings_scanned: totalListingsScanned,
            unique_items: uniqueItemsCount
        }
    }, 200);
};
