let mapToken=mapToken
	mapboxgl.accessToken =mapToken;
   const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: coordinates, // Use dynamic coordinates
        zoom: 9
    });

    // Add marker at coordinates
    new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);