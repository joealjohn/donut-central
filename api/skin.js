const { sanitizeInput, handleCors } = require('./config.js');

/**
 * Skin Proxy - Fetches Minecraft skins
 * GET /api/skin?username=USERNAME
 */
module.exports = async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    // Set headers for image response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    let username = req.query.username ? sanitizeInput(req.query.username).replace(/[^a-zA-Z0-9_]/g, '') : '';
    if (!username) username = 'Steve';

    let uuid = null;
    let skinData = null;

    try {
        // Get UUID from Mojang
        const uuidResponse = await fetch(
            `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`
        );
        
        if (uuidResponse.ok) {
            const uuidData = await uuidResponse.json();
            if (uuidData && uuidData.id) {
                uuid = uuidData.id;
            }
        }
    } catch (e) {
        // Continue without UUID
    }

    if (uuid) {
        try {
            // Get profile with skin data
            const profileResponse = await fetch(
                `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
            );
            
            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                if (profileData && profileData.properties) {
                    for (const prop of profileData.properties) {
                        if (prop.name === 'textures') {
                            const texturesJson = Buffer.from(prop.value, 'base64').toString('utf-8');
                            const textures = JSON.parse(texturesJson);
                            
                            if (textures.textures?.SKIN?.url) {
                                const skinResponse = await fetch(textures.textures.SKIN.url);
                                if (skinResponse.ok) {
                                    skinData = Buffer.from(await skinResponse.arrayBuffer());
                                }
                            }
                            break;
                        }
                    }
                }
            }
        } catch (e) {
            // Continue to fallbacks
        }
    }

    // Fallback URLs
    if (!skinData) {
        const fallbackUrls = [
            uuid ? `https://crafatar.com/skins/${uuid}` : null,
            `https://minotar.net/skin/${username}`
        ].filter(Boolean);

        for (const url of fallbackUrls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const buffer = Buffer.from(await response.arrayBuffer());
                    if (buffer.length > 100) {
                        skinData = buffer;
                        break;
                    }
                }
            } catch (e) {
                continue;
            }
        }
    }

    if (skinData) {
        res.send(skinData);
    } else {
        res.status(404).end();
    }
};
