const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) { 
    request('https://api.ipify.org?format=json', (error, response, body) => {
        if(error)  return callback(error, null);
        
        if (response.statusCode !== 200) {
            const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
            callback(Error(msg), null);
            return;
          } 
            const ip = JSON.parse(body).ip;
            callback(null, ip);
        
    });
  };


const fetchCoordsByIP = function(ip, callback){
    request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
        if(error)  return callback(error, null);
        
        if (response.statusCode !== 200) {
            const msg = `Status Code ${response.statusCode} when fetching coordinates Response: ${body}`;
            callback(Error(msg), null);
            return;
          } else{
        //   const data = JSON.parse(body);
        //   let longLat = {};
        //   longLat.latitude = data['data']['latitude'];
        //   longLat.longitude = data['data']['longitude'];
        //   callback(null, longLat);
          const { latitude, longitude } = JSON.parse(body).data;
          callback(null, { latitude, longitude });
        };
        
    });

};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
    let url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
    request(url, (error, response, body) => {
        if(error)  return callback(error, null);
        
        if (response.statusCode !== 200) {
            const msg = `Status Code ${response.statusCode} when fetching coordinates Response: ${body}`;
            callback(Error(msg), null);
            return;
          } else{
          const time = JSON.parse(body).response;
          callback(null, time);
        };
        
    });
  };
  const nextISSTimesForMyLocation = function(callback) {
    fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }
  
      fetchCoordsByIP(ip, (error, loc) => {
        if (error) {
          return callback(error, null);
        }
  
        fetchISSFlyOverTimes(loc, (error, nextPasses) => {
          if (error) {
            return callback(error, null);
          }
  
          callback(null, nextPasses);
        });
      });
    });
  };

  
  module.exports = { fetchMyIP,
    fetchCoordsByIP,
    fetchISSFlyOverTimes,
    nextISSTimesForMyLocation
 };





