const { fetchMyIP } = require('./iss');
const { fetchCoordsByIP } = require('./iss');
const { fetchISSFlyOverTimes } = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss')

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   } 
//   console.log('It worked! Returned IP:' , ip);
// });

// fetchCoordsByIP('173.35.230.208',(error, data) => {
//     if (error) {
//         console.log("Error", error.message);
//         return;
//     } 
//         console.log('It worked! Returned coord:', data);

// });

// fetchISSFlyOverTimes ({ latitude: '43.66550', longitude: '-79.42040' },(error, data) => {
//     if (error) {
//         console.log("Error", error.message);
//         return;
//     } 
//         console.log('It worked! Returned:', data);

// });
const printPassTimes = function(passTimes) {
    for (const pass of passTimes) {
      const datetime = new Date(0);
      datetime.setUTCSeconds(pass.risetime);
      const duration = pass.duration;
      console.log(`Next pass at ${datetime} for ${duration} seconds!`);
    }
  };


nextISSTimesForMyLocation((error, passTimes) => {
    if (error) {
      return console.log("It didn't work!", error);
    }
    // success, print out the deets!
    printPassTimes(passTimes);
  });

