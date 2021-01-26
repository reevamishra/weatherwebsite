const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=a78520062d6a5a3318ab37f281d56d6b&query='+latitude+','+longitude+'&units=f';
    request({url, json:true} , (error, { body }) => {
        if(error){
            callback('Unable to connect to weather service', undefined)
        } else if(body.error) {
            callback('Unable to find with co-ordinates', undefined)
        } else {
            callback(undefined, {
                temperature : body.current.temperature,
                Status : body.current.weather_descriptions[0]
            })
        }
    })
}

module.exports = {
    forecast
}