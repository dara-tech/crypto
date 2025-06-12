import axios from 'axios';

const SERVER_URL = 'https://crypto-nmz7.onrender.com';
const TIMEOUT = 5000; // 5 seconds timeout

/**
 * Checks if the server is up and running
 * @returns {Promise<boolean>} True if server is up, false otherwise
 */
export const checkServerHealth = async () => {
  try {
    const response = await axios.get(SERVER_URL, {
      timeout: TIMEOUT,
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.status === 200;
  } catch (error) {
    console.error('Server health check failed:', error.message);
    return false;
  }
};

export default checkServerHealth;
