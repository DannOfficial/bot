const axios = require("axios");

async function SpotifySearch(query) {
    try {
        const response = await axios.get("https://spotifyku.my.id/search", {
            params: {
                query: query
            }
        });
        const result = response.data;
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function SpotifyDownload(url) {
    try {
        const response = await axios.get("https://spotifyku.my.id/download", {
            params: {
                url: url
            }
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    SpotifySearch,
    SpotifyDownload
}