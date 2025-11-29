Donut Stats – DonutSMP Player Statistics Platform

A complete stats-tracking platform for DonutSMP players.
Browse in-depth player statistics, global leaderboards, auction house listings, and real-time server information — all in one place.

🚀 Quick Setup
1. Add Your API Key

Open api/config.php and insert your DonutSMP API key:

$API_KEY = 'your_api_key_here';


Get your API key by running /api in-game on DonutSMP.

2. Deploy to Your Web Server

Copy the full project to a PHP-enabled server.

XAMPP:

htdocs/donut-stats/


Apache (Linux):

/var/www/html/donut-stats/

3. Open the Website

Local:

http://localhost/donut-stats/public/


Production:

https://yourdomain.com/public/

📁 Project Structure
donut-stats/
│
├─ public/                     # Frontend files
│   ├─ index.html              # Homepage with hero + features
│   ├─ stats.html              # Player statistics page
│   ├─ leaderboards.html       # Leaderboards UI
│   ├─ auction.html            # Auction house browser
│   ├─ api-docs.html           # API documentation (Swagger-style)
│   └─ assets/
│       ├─ css/style.css       # Main donut-themed stylesheet
│       ├─ js/app.js           # Frontend logic
│       └─ images/             # Icons, backgrounds, logo
│
└─ api/                        # Backend PHP proxies (hides API key)
    ├─ config.php              # API key configuration
    ├─ stats.php               # Player statistics endpoint
    ├─ leaderboard.php         # Leaderboards endpoint
    ├─ auction.php             # Auction data endpoint
    └─ lookup.php              # Player lookup endpoint

🎨 Customization
Theme Colors (style.css)
:root {
    --primary-pink: #FF66C4;
    --accent-purple: #AA78FF;
    --bg-dark: #0f1115;
    --card-bg: #1a1d23;
}

Fonts Used

Poppins – clean body text

Press Start 2P – pixel/retro headings for Minecraft style

📡 API Endpoints

All requests pass through PHP to protect the API key.

Endpoint	Description
/api/stats.php?user=USERNAME	Fetch player statistics
/api/lookup.php?user=USERNAME	View player rank/location
/api/leaderboard.php?type=TYPE&page=PAGE	Leaderboard results
/api/auction.php?page=PAGE&search=QUERY&sort=SORT	Auction house listings
Available Leaderboard Types
money, kills, deaths, playtime, shards,
brokenblocks, placedblocks, mobskilled,
sell, shop

Auction Sort Options
lowest_price, highest_price,
recently_listed, last_listed

⚠️ Rate Limiting

The DonutSMP Public API allows 250 requests/minute per API key.
This platform includes automatic handling for 429 Too Many Requests responses and displays retry messages to users.

📝 License

This is an unofficial fan-made project created for the DonutSMP community.
Not affiliated with DonutSMP or its owners.

Made with 🍩 for the DonutSMP players ❤️
