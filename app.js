window.onload = () => {

    const address = document.querySelector('#address')
    const buttonSearch = document.querySelector('#btn')
    
    const ip = document.querySelector('#ip')
    const location = document.querySelector('#location')
    const timezone = document.querySelector('#timezone')
    const isp = document.querySelector('#isp')
    const map = L.map('map', { zoomControl: false })


    setLayerMap()
    trackAddress()

    buttonSearch.onclick = trackAddress


    function trackAddress() {
        let addressToTrack = address.value

        if (validateAddress(addressToTrack)) {
            let cleanedAdderss = cleanAddress(addressToTrack)
            fetchAddress(cleanedAdderss) 
        }
    }

    function validateAddress(address) {
        if (!address) {
            alert('📢 Indicate some address')
            return false
        }

        return true
    }

    function cleanAddress(address) {
        address = address.trim()

        const [http, https] = ['http://', 'https://']

        if (address.startsWith(http)) {
            address = address.slice(http.length)
        } else if (address.startsWith(https)) {
            address = address.slice(https.length)
        }

        return address[address.length - 1] === '/' ? address.slice(0, address.length - 1) : address
    }

    function fetchAddress(address) {
        fetch(`https://geo.ipify.org/api/v1?apiKey=at_KTIV3epeFvXQo4oFDdeiCjd6XfYnq&ipAddress=${address}`)
        .then(res => res.json())
        .then(data => {
            printData(data)
            setViewMap(data.location)
        })
        .catch(err => {
            fetch(`https://geo.ipify.org/api/v1?apiKey=at_KTIV3epeFvXQo4oFDdeiCjd6XfYnq&domain=${address}`)
            .then(res => res.json())
            .then(data => {
                printData(data)
                setViewMap(data.location)
            })
            .catch(err => {
                alert('Ops! something went wrong... 😢. Check that the address is correctly written')
            })
        })
    }

    function printData(data) {
        ip.textContent = data.ip
        location.textContent = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`
        timezone.textContent = `${data.location.timezone}`
        isp.textContent = data.isp

        address.value = ''
    }

    function setViewMap(location) {
        map.setView([location.lat, location.lng], 13)        
    }

    function setLayerMap() {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZGF3YWxiZXJ0byIsImEiOiJja2gyazZmdW8wZGQ5MndwYzRoeTBuamw0In0.Qyxd8mQt7OlIbhV4UkSUNw'
        }).addTo(map)
    }

}