window.onload = function() {
  var Periskop = {
      init: function () {
          if (navigator.geolocation) {
              navigator.geolocation.watchPosition(Periskop.update)
          } else {
              console.log("No Geolocation possible. Please enable GPS and WIFI settings.");
          }
      },
      debug: function (message) {
          document.getElementById("debug-message").innerHTML = message;
      },
      getTimeStamp: function () {
          return new Date().getTime();
      },
      loadStreetViewImage: function (latitude, longitude) {
          fov = typeof fov !== 'undefined' ? fov : 90;
          heading = typeof heading !== 'undefined' ? heading : 0;
          pitch = typeof pitch !== 'undefined' ? pitch : 0;
          document.getElementById("streetview").innerHTML = "<img src='http://maps.googleapis.com/maps/api/streetview?size=640x640&location="+ latitude + ",%20" + longitude + "&fov=" + fov + "&heading=" + heading + "&pitch=" + pitch + "&sensor=true'>";
      },
      update: function (position) {
          position = position.coords;
          // Periskop.loadStreetViewImage(position.latitude, position.longitude);
          Periskop.loadStreetViewImage(42.345573,-71.098326);
          // Debug
          time = Periskop.getTimeStamp();
          Periskop.debug(time + " // " + position.latitude + ", " + position.longitude);
      }
  };
  Periskop.init();
};