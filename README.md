# Donut Stats - DonutSMP Statistics Platform

A comprehensive stats tracking platform for DonutSMP players. View detailed player statistics, leaderboards, auction house data, and real-time server information.

## 🚀 Quick Setup

### 1. Configure API Key

Open `api/config.php` and replace the placeholder with your DonutSMP API key:

```php
$API_KEY = 'your_api_key_here';
```

To get an API key, run `/api` in-game on DonutSMP.

### 2. Deploy to Web Server

Copy the entire project to your web server (Apache with PHP support recommended):
- For XAMPP: Place in `htdocs/donut-stats/`
- For Apache: Place in `/var/www/html/donut-stats/`

### 3. Access the Site

Open your browser and navigate to:
- Local: `http://localhost/donut-stats/public/`
- Production: `https://yourdomain.com/public/`

## 📁 Project Structure

```
donut-stats/
│
├─ public/                    # Frontend files (publicly accessible)
│   ├─ index.html            # Homepage with hero and features
│   ├─ stats.html            # Player statistics page
│   ├─ leaderboards.html     # All leaderboard categories
│   ├─ auction.html          # Auction house browser
│   ├─ api-docs.html         # API documentation (Swagger-style)
│   └─ assets/
│       ├─ css/style.css     # Main stylesheet (donut theme)
│       ├─ js/app.js         # Frontend JavaScript
│       └─ images/           # Images and logo
│
└─ api/                       # Backend PHP proxy (protects API key)
    ├─ config.php            # API configuration (put your key here!)
    ├─ stats.php             # Player stats endpoint
    ├─ leaderboard.php       # Leaderboards endpoint
    ├─ auction.php           # Auction house endpoint
    └─ lookup.php            # Player lookup endpoint
```

## 🎨 Customization

### Colors (in style.css)

```css
:root {
    --primary-pink: #FF66C4;      /* Main accent color */
    --accent-purple: #AA78FF;      /* Secondary accent */
    --bg-dark: #0f1115;            /* Background color */
    --card-bg: #1a1d23;            /* Card backgrounds */
}
```

### Fonts

The site uses:
- **Poppins** - Body text
- **Press Start 2P** - Pixel-style headings (Minecraft aesthetic)

## 📡 API Endpoints

All API calls go through PHP proxies to protect your API key:

| Endpoint | Description |
|----------|-------------|
| `/api/stats.php?user=USERNAME` | Get player statistics |
| `/api/lookup.php?user=USERNAME` | Look up player location/rank |
| `/api/leaderboard.php?type=TYPE&page=PAGE` | Get leaderboard data |
| `/api/auction.php?page=PAGE&search=QUERY&sort=SORT` | Browse auction house |

### Leaderboard Types

- `money`, `kills`, `deaths`, `playtime`, `shards`
- `brokenblocks`, `placedblocks`, `mobskilled`, `sell`, `shop`

### Auction Sort Options

- `lowest_price`, `highest_price`, `recently_listed`, `last_listed`

## ⚠️ Rate Limits

The DonutSMP API has a limit of **250 requests per minute** per API key. The frontend handles 429 responses gracefully and shows retry messages.

## 📝 License

This is a fan-made project for the DonutSMP community. Not affiliated with DonutSMP officially.

---

Made with 🍩 for the DonutSMP community
