import axios from "axios";

const axiosRetry = require('axios-retry')

axiosRetry(axios, {
  retries: 1,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  }
});

export default axios
