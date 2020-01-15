var map;
var directionsService;
var directionsDisplay;

new Vue({
  el: "#app",
  data: {
    originLatLng: "13.7469267, 100.5327943",
    destinationLatLng: "13.7430621, 100.5466558",
    directionRoutes: []
  },
  created() {
    setTimeout(() => {
      this.initMap();
    }, 1000);
  },
  methods: {
    initMap() {
      directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer();
      var directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true
      });

      var mapCenter = new google.maps.LatLng(13.736717, 100.523186);

      var mapOptions = {
        zoom: 14,
        center: mapCenter
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      directionsRenderer.setMap(map);

      var mapOrigin1 = new google.maps.LatLng(13.7469267, 100.5327943);
      var mapDestination1 = new google.maps.LatLng(13.7430621, 100.5466558);

      var mapOrigin2 = new google.maps.LatLng(46.5476592, 26.515106);
      var mapDestination2 = new google.maps.LatLng(46.4444641, 27.362008);

      // this.calculateRoute(mapOrigin1, mapDestination1);
      // this.calculateRoute(mapOrigin2, mapDestination2);
    },
    calculateRoute(mapOrigin, mapDestination) {
      let self = this;
      var request = {
        origin: mapOrigin,
        destination: mapDestination,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(/* now, or future date */),
          trafficModel: "pessimistic" // optimistic
        },
        unitSystem: google.maps.UnitSystem.IMPERIAL
      };

      return new Promise((resolve, reject) => {
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            let routes = response.routes.sort((a, b) => {
              return b.legs[0].distance.value - a.legs[0].distance.value;
            });
            response["routes"] = routes;

            let directionRoutes = [];
            for (var i = 0; i < routes.length; i++) {
              let color = "#00b3fd";
              let strokeWeight = 7;
              if (i < routes.length - 1) {
                color = self.getRandomColor();
                strokeWeight = 6;
              }

              let directionRoute = {
                color: color
              };

              var polyline = new google.maps.Polyline({
                strokeColor: color,
                strokeOpacity: 1,
                strokeWeight: strokeWeight
              });
              var dr = new google.maps.DirectionsRenderer({
                polylineOptions: polyline
              });
              dr.setDirections(response);
              dr.setRouteIndex(i);
              dr.setMap(map);

              var directionsData = routes[i].legs[0]; // Get data about the mapped route
              if (directionsData) {
                let distance = directionsData.distance.text;
                let duration = directionsData.duration.text;
                directionRoute["distance"] = distance;
                directionRoute["duration"] = duration;
              }

              directionRoutes.push(directionRoute);
            }

            resolve(directionRoutes);
            // directionsDisplay.setDirections(response);
          }
        });
      });
    },
    addRoute() {
      if (
        this.originLatLng.indexOf(",") > 1 &&
        this.destinationLatLng.indexOf(",") > 1
      ) {
        let origins = this.originLatLng.split(",");
        let destinations = this.destinationLatLng.split(",");
        try {
          var mapOrigin = new google.maps.LatLng(origins[0], origins[1]);
          var mapDestination = new google.maps.LatLng(
            destinations[0],
            destinations[1]
          );
          this.calculateRoute(mapOrigin, mapDestination)
            .then(routes => {
              this.directionRoutes = routes;
            })
            .catch(e => {
              console.log(e);
            });

          this.originLatLng = "";
          this.destinationLatLng = "";
        } catch (e) {
          alert("Latitude and Logitude invalid!");
        }
      } else {
        alert("Please enter latitude,longitude");
      }
    },
    getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  }
});
