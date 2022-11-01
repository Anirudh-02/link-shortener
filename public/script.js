let dialog = document.getElementById('short_url_clicks')
let buttons = document.getElementsByClassName('btn')
close = document.getElementById('closeModal')
inpShortenURl = document.getElementById('inpShortenUrl')
inpGetClicks = document.getElementById('inpGetClicks')

btnArray = [...buttons]

dialog.addEventListener('close', () => {
    dialog.firstChild.textContent = ''
    document.getElementById('shortUrl').textContent = ''
})

btnArray.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('ShortenUrl')) {
            if (!inpShortenURl.value) return
            fetch('http://localhost:4000/shortenUrl', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullUrl: inpShortenURl.value })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.shortUrl == 'Url is invalid') {
                        dialog.textContent == data.shortUrl
                        return
                    }
                    document.getElementById('shortUrl').setAttribute('href', `http://localhost:4000/${data.shortUrl}`)
                    document.getElementById('shortUrl').textContent = `http://localhost:4000/${data.shortUrl}`
                })
                .catch((err) => console.error(err))
        }
        if (button.classList.contains('GetClicks')) {
            if (!inpGetClicks.value) return
            fetch('http://localhost:4000/shortUrlDetails', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ shortUrlCode: inpGetClicks.value })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.clicks == 'No such short URL exists') {
                        dialog.textContent = data.clicks
                        return
                    }
                    dialog.firstChild.textContent = `Number of clicks on code ${inpGetClicks.value} : ${data.clicks}`
                })
                .catch((err) => console.error(err))
        }
        dialog.showModal()
    })    
});



close.addEventListener('click', () => {
    dialog.close()
})