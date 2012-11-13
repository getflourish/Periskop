window.onload = function() {
  window.Periskop = {
      images: [],
      init: function () {
          if (navigator.geolocation) {
              navigator.geolocation.watchPosition(Periskop.update)
          } else {
              console.log("No Geolocation possible. Please enable GPS and WIFI settings.");
          }
          
          if (window.DeviceOrientationEvent) {
              window.addEventListener('deviceorientation', onDeviceOrientation, false);
              Periskop.debug("Device Orientation supported");
          } else {
              Periskop.debug("Device Orientation not supported");
              console.log("Device Orientation not supported.");
          }
      },
      debug: function (message) {
          $("#debug-message").html(message);
      },
      getTimeStamp: function () {
          return new Date().getTime();
      },
      loadStreetViewImage: function (latitude, longitude) {
          fov = typeof fov !== 'undefined' ? fov : 90;
          heading = typeof heading !== 'undefined' ? heading : 0;
          pitch = typeof pitch !== 'undefined' ? pitch : 0;
          var image = new Image();
          image.id = "t"+Periskop.getTimeStamp();
          Periskop.images.push(image);
          image.onload = function (event) {
              $(image).data("loaded", true);
              Periskop.showLatestImage();
          };
          image.src = "http://maps.googleapis.com/maps/api/streetview?size=640x640&location="+ latitude + ",%20" + longitude + "&fov=" + fov + "&heading=" + heading + "&pitch=" + pitch + "&sensor=true";
      },
      showLatestImage: function () {
          var done = false;
          for (var i = Periskop.images.length - 1; i >= 0; i--) {
              if ($(Periskop.images[i]).data("loaded")) {
                  done = i;
                  break;
              }
          };
          if (done) {
              $("#streetview").append(Periskop.images[done]);
              // is there an old image that needs removing?
              if ($("#streetview").children().size() > 1) {
                  var oldImage = $("#streetview").children().first();
                  console.dir(oldImage);
                  oldImage.animate(
                      {
                          opacity: 0,
                          scale: 2
                      },
                      {
                          complete: function (event) {
                              // alle vorigen Bilder löschen
                              oldImage.remove();
                              Periskop.images.splice(0, i+1);
                          }
                      }
                  );
              } else {
                  // no old images, but our queue needs to be cleaned out,
                  // delete all images we tried to load previously
                  Periskop.images.splice(0, i+1);
              }
          }
      },
      onDeviceOrientation: function (event) {
          // Periskop.debug(event.alpha);
      },
      update: function (position) {
          position = position.coords;
          // Periskop.loadStreetViewImage(position.latitude, position.longitude);
          Periskop.loadStreetViewImage(42.345573,-71.098326);
          // Debug
          time = Periskop.getTimeStamp();
          // Periskop.debug(time + " // " + position.latitude + ", " + position.longitude);
      }
  };
  Periskop.init();
};