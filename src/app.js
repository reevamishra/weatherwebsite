const path = require('path');
const express = require('express');
const hbs = require('hbs');

const gC = require('./utils/geocode');
const fC = require('./utils/forecast');

console.log(__dirname)
console.log(path.join(__dirname,'../public'))

const app = express();

//Define paths for express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title: "Weather App",
        name: "Reeva"
    })
})
app.get('/about', (req,res) => {
    res.render('about', {
        title: "About Me",
        name: "Reeva"
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: "Help",
        message: "Please drop a question",
        name: "Reeva"
    })
})

app.get('/weather', (req,res) => {
    if(!req.query.address) {
        return res.send({
            error: "You must provide an address"
        })
    }

    const location = req.query.address;
    gC.geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({error});
        }
        fC.forecast(latitude, longitude, (error, forecastdata) => {
            if(error) { 
                return res.send({ error });
            }
    
            res.send({
                location,
                forecastdata,
                address: req.query.address
            });
        })
    })

})


app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: "You must provide a search term"
        })
    }

    console.log(req.query.search);
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: "404",
        errormessage: "Help Article not found",
        name: "Reeva"
    })
})

app.get('*', (req,res) => {
    res.render('404', {
        title: "404",
        errormessage: "Page not found",
        name: "Reeva"
    })
})

app.listen(3000, () => {
    console.log("The server started correctly");
});