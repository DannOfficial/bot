const axios = require('axios');

const GPT_API_URL = "https://chat.hop.sh/gpt";
const BARD_API_URL = "https://chat.hop.sh/bard";

class ChatBase {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error(`Please provide an API key. (Join the discord server and get the apikey for free)`);
    }
    this.apiKey = apiKey;
  }

  async gpt(prompt) {
    try {
      const payload = {
        prompt: prompt,
      };

      const authHeader = `Bearer ${this.apiKey}`;

      const headers = {
        Authorization: authHeader,
      };

      const response = await axios.post(GPT_API_URL, payload, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`ChatBase API Error: ${error.message}`);
    }
  }
  
  async bard(prompt) {
    try {
      const payload = {
        prompt: prompt,
      };

      const authHeader = `Bearer ${this.apiKey}`;

      const headers = {
        Authorization: authHeader,
      };

      const response = await axios.post(BARD_API_URL, payload, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`ChatBase API Error: ${error.message}`);
    }
  }
}

module.exports = ChatBase;