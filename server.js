const express = require('express')
const { default: mongoose } = require('mongoose')
const shortUrlModel = require('./models/shortUrls')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 4000

mongoose.connect(process.env.MONGO_URL)

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/shortenUrl', async (req, res) => {
    try {
        urlOrZero = validateAndFixUrl(req.body.fullUrl)
        console.log(urlOrZero);
        if (urlOrZero == 0) {
            res.send({ shortUrl: 'Url is invalid' })
            return
        }
        let urlEntry = (await shortUrlModel.create({ fullUrl: urlOrZero })).toJSON()
        res.status(201).send({ shortUrl: urlEntry.shortUrl} )
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})

app.post('/shortUrlDetails', async (req, res) => {
    try {
        let urlEntry = await shortUrlModel.findOne({ shortUrl: req.body.shortUrlCode })
        let response = urlEntry ? JSON.stringify(urlEntry.toJSON().clicks) : 'No such short URL exists'
        res.send({ clicks: response })
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})

app.get('/:shortUrl', async (req, res) => {
    try {
        if (!req.params.shortUrl || req.params.shortUrl == 'favicon.ico') return
        console.log(req.params.shortUrl)
        if (!req.params.shortUrl) return
        let urlEntryDoc = await shortUrlModel.findOne({ shortUrl: req.params.shortUrl })
        console.log(urlEntryDoc);
        let urlEntryJson = urlEntryDoc.toJSON()
        res.status(301).redirect(urlEntryJson.fullUrl)
        urlEntryDoc.clicks += 1
        urlEntryDoc.save()   
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})

function validateAndFixUrl(url) {
    if (/(^http)/gi.test(url)) {
        if (/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(url)) {
            return url
        }
        else {
            return 0
        }
    }
    else {
        url = 'http://' + url
        if (/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(url)) {
            return url
        } else {
            return 0
        }
    }
}

app.listen(PORT, () => {
    console.log("server running at http://localhost:4000");
})