window.onload = function() {
  window.Periskop = {
      images: [],
      lastPosition: {},
      orientation: {},
      init: function () {
          if (navigator.geolocation) {
              navigator.geolocation.watchPosition(Periskop.update)
          } else {
              console.log("No Geolocation possible. Please enable GPS and WIFI settings.");
          }
          
          if (window.DeviceOrientationEvent) {
              window.addEventListener('deviceorientation', Periskop.onDeviceOrientation, false);
          } else {
              console.log("Device Orientation not supported.");
          }
          
          window.onorientationchange = function () {
              Periskop.scaleImage();
          }
      },
      debug: function (message) {
          $("#debug-message").html(message);
      },
      getTimeStamp: function () {
          return new Date().getTime();
      },
      loadStreetViewImage: function (latitude, longitude, fov, heading, pitch) {
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
          image.src = "http://maps.googleapis.com/maps/api/streetview?size=640x640&location="+ latitude + ",%20" + longitude + "&fov=" + fov + "&heading=" + heading + "&pitch=" + pitch + "&sensor=true&amp;key=AIzaSyB2UK5VXTKYM06E6J_EJ0KomAACL1_XAjs";
      },
      scaleImage: function (image) {
          if (!image && $("#streetview").children().size()) {
              image = $("#streetview").children().first();
          } else if (!image) {
              return;
          }
          switch (window.orientation) {
              case 90:
              case -90:
                  maxDimension = $(window).width();
                  break;
              case 0:
              case 180:
                  maxDimension = $(window).height();
              break;
          }    
          image.attr("width", maxDimension);
          image.attr("height", maxDimension);
          image.css("top", (($(window).height() - image.height())/2)+"px");              
          image.css("left", (($(window).width() - image.width())/2)+"px");
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
              var currentImage = $(Periskop.images[done]);
              $("#streetview").append(currentImage);
              Periskop.scaleImage(currentImage);
              
              // is there an old image that needs removing?
              if ($("#streetview").children().size() > 1) {
                  var oldImage = $("#streetview").children().first();
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
          Periskop.orientation = event;
          // throttle
          if (Periskop.getTimeStamp() - Periskop.lastUpdate > 1000) {
              Periskop.update(lastPosition); 
          }
      },
      update: function (position) {
          lastPosition = position;
          position = position.coords;
          Periskop.loadStreetViewImage(position.latitude, position.longitude, 90, 180-Periskop.orientation.alpha, 0);
      }
  };
  Periskop.init();
};