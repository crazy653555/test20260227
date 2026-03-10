import axios from 'axios';

// Replace with your actual .NET Core API port from launchSettings.json usually 5000 or 5001, or Kestrel defaults like 5271. 
// We will need to check what port Kestrel is actually running on. Typically it's 5000 (http) and 5001 (https) or dynamic from properties/launchSettings.json
const api = axios.create({
    baseURL: 'http://localhost:5232/api',
});

export default api;
