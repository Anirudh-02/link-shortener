let dialog = document.getElementById('short_url_clicks')
let buttons = document.getElementsByClassName('btn')
close = document.getElementById('closeModal')
inpShortenURl = document.getElementById('inpShortenUrl')
inpGetClicks = document.getElementById('inpGetClicks')
shortUrl = document.getElementById('shortUrl')
copyBtn = document.getElementById('copy')

btnArray = [...buttons]

dialog.addEventListener('close', () => {
    dialog.firstChild.textContent = ''
    document.getElementById('shortUrl').textContent = ''
})

copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(shortUrl.textContent)
})

btnArray.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('ShortenUrl')) {
            if (!inpShortenURl.value) return
            fetch(`${window.location.href}shortenUrl`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullUrl: inpShortenURl.value })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.shortUrl == 'Url is invalid') {
                        dialog.textContent = data.shortUrl
                        return
                    }
                    shortUrl.textContent = `${window.location.href}${data.shortUrl}`
                    shortUrl.setAttribute('href', `${window.location.href}${data.shortUrl}`)
                })
                .catch((err) => console.error(err))
        }
        if (button.classList.contains('GetClicks')) {
            if (!inpGetClicks.value) return
            fetch(`${window.location.href}shortUrlDetails`, {
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
                    dialog.textContent = `Number of clicks on code ${inpGetClicks.value} : ${data.clicks}`
                })
                .catch((err) => console.error(err))
        }
        dialog.showModal()
    })    
});




close.addEventListener('click', () => {
    dialog.close()
})