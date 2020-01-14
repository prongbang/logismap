var map;
var directionsService;
var directionsDisplay;

new Vue({
  el: "#app",
  data: {
    originLatLng: "",
    destinationLatLng: "",
    locations: []
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

      var mapCenter = new google.maps.LatLng(13.736717, 100.523186);

      var mapOptions = {
        zoom: 14,
        center: mapCenter
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      var mapOrigin1 = new google.maps.LatLng(13.7469267,100.5327943);
      var mapDestination1 = new google.maps.LatLng(13.7430621,100.5466558);

      var mapOrigin2 = new google.maps.LatLng(46.5476592, 26.515106);
      var mapDestination2 = new google.maps.LatLng(46.4444641, 27.362008);

      //   this.calculateRoute(mapOrigin1, mapDestination1);
      //   this.calculateRoute(mapOrigin2, mapDestination2);
    },
    calculateRoute(mapOrigin, mapDestination) {
      var request = {
        origin: mapOrigin,
        destination: mapDestination,
        travelMode: "DRIVING"
      };
      directionsService.route(request, function(result, status) {
        if (status == "OK") {
          var directionsDisplay = new google.maps.DirectionsRenderer({
            map: map
          });
          directionsDisplay.setDirections(result);
        }
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
          this.calculateRoute(mapOrigin, mapDestination);

          this.locations.push({origin: origins, des: destinations});

          this.originLatLng = "";
          this.destinationLatLng = "";
        } catch (e) {
          alert("Latitude and Logitude invalid!");
        }
      } else {
        alert("Please enter latitude,longitude");
      }
    }
  }
});
