window.onload = () => {

    const ip = document.querySelector('#ip')
    const buttonSearch = document.querySelector('#btn')

    const address = document.querySelector('#address')
    const location = document.querySelector('#location')
    const timezone = document.querySelector('#timezone')
    const isp = document.querySelector('#isp')
    const map = L.map('map', { zoomControl: false })


    setLayerMap()
    trackIp()

    buttonSearch.onclick = trackIp


    function trackIp() {
        let ipToSearch = ip.value
        validateIp(ipToSearch) && getIPInfo(ipToSearch)
    }

    function validateIp(ip) {
        if (!ip) {
            alert('📢 Indicate some IP address')
            return false
        }

        let splitedIp = ip.split('.')

        if (splitedIp.length !== 4) {
            alert('📢 IP address is made up of four octets separated by dots. For example 8.8.8.8')
            return false
        }

        for (let i = 0; i < splitedIp.length; i++) {
            let octet = splitedIp[i]

            if (!Number(octet) && octet !== '0') {
                alert('📢 Octets have to be numbers')
                return false
            }
        }

        return true
    }

    function getIPInfo(ip) {
        fetch(`https://geo.ipify.org/api/v1?apiKey=at_KTIV3epeFvXQo4oFDdeiCjd6XfYnq&ipAddress=${ip}`)
        .then(res => res.json())
        .then(data => {
            printData(data)
            setViewMap(data.location)
        })
        .catch(err => {
            alert('Ops! something went wrong... 😢')
        })
    }

    function printData(data) {
        address.textContent = data.ip
        location.textContent = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`
        timezone.textContent = `${data.location.timezone}`
        isp.textContent = data.isp

        ip.value = ''
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