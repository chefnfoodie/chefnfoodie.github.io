function initializeMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 49.2569332,
      lng: -123.1239135
    },
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    latitude: 49.2569332,
    longitude: -123.1239135
  });
  viewModelObject.map = map;
  viewModelObject.map.markers = [];
  loadInitialMapData(viewModelObject);
}

// Load initial map, marker and weather data
function loadInitialMapData(viewModel) {

  var map = viewModel.map;
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  searchPlace = input.value;

  var searchBox = new google.maps.places.SearchBox(input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a location and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var input = document.getElementById('pac-input');
    searchPlace = input.value;
    var places = searchBox.getPlaces();
    if (places.length === 0) {
      return;
    }
    var myLatlng1 = {
      lat: map.latitude,
      lng: map.longitude
    };
    // For each place, get the icon, name and location.
    // In this case there should be only one place
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
        center: myLatlng1
      };
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      // Update latitude/longitude so we can use from the place where weather API is called
      map.latitude = place.geometry.location.lat();
      map.longitude = place.geometry.location.lng();
    });
    map.fitBounds(bounds);
    callWeatherAPI(viewModel);
    callNYTimesArticleAPI(viewModel);
  });
  // load weather data for initial location (Vancouver)
  callWeatherAPI(viewModel);
  callNYTimesArticleAPI(viewModel);
}



function callNYTimesArticleAPI(viewModel) {
  var nytimesAPIKey = "9b2521936bd38fb2075818578ac0855c%3A6%3A72516684";
  var requestString = "http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=" + searchPlace + "&sort=newest&api-key=" + nytimesAPIKey;
  $.ajax({
    url: requestString,
    dataType: 'text', // Choosing a text datatype
    success: function(apiResponse) {
      processNytimesAPIResult(viewModel, apiResponse);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert("Unable to load data from New York Times now!");
    }
  });
}

var processNytimesAPIResult = function(viewModel, apiResponse) {
  var newsDiv = document.getElementById("relatedNews");
  while (newsDiv.firstChild) {
    newsDiv.removeChild(newsDiv.firstChild);
  }

  var results = JSON.parse(apiResponse);
  if (results.response.docs !== null && results.response.docs.length > 0) {
    var len = results.response.docs.length;

    for (var k = 0; k < len; k++) {
      var web_url = results.response.docs[k].web_url;
      var snippet = results.response.docs[k].snippet;
      var content = "<div id = 'newsItem'> <h4>" + snippet + "</h4>" + "<a target=\"_blank\" href=" + web_url + ">Click here to read</a>";
      newsDiv.innerHTML = newsDiv.innerHTML + content;
    }
  }
};

// Make Ajax call to OpenWeatherMap API, parse the results and display
// the markers on map along with weather info on the side box
function callWeatherAPI(viewModel) {

  var map = viewModel.map;
  var openWeatherAPIKey = "32185e21f26ced31524446c346285787";
  // Get weather from OpenWeatherMap for this location and around this location
  var requestString = "http://api.openweathermap.org/data/2.5/find?units=metric&lat=" + map.latitude + "&lon=" + map.longitude + "&APPID=" + openWeatherAPIKey + "&cnt=15";
  $.ajax({
    url: requestString,
    dataType: 'text', // Choosing a text datatype
    success: function(apiResponse) {
      proccessWeatherAPIResult(viewModel, apiResponse);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert("Unable to load weather data now!");
    }
  });
}

// Function to process weather API result

var proccessWeatherAPIResult = function(viewModel, apiResponse) {
  //Have to clear the existing places and markers w.r.t search box ,filterview and weatherbox before
  //making fresh api calls and displaying the relavent markers
  // clear the existing markers of location search

  var map = viewModel.map;
  map.markers.forEach(function(marker) {
    marker.setMap(null);
  });
  map.markers = [];
  //clear the existing filterview places array
  viewModel.placeList.removeAll();
  for (var i = 0; i < viewModel.placeList().length; i++) {
    viewModel.placeList.pop();
  }
  //clear the existing weatherbox places array
  viewModel.listViewList.removeAll();
  for (var j = 0; j < viewModel.listViewList().length; j++) {
    viewModel.listViewList.pop();
  }
  var results = JSON.parse(apiResponse);
  if (results.list !== null && results.list.length > 0) {
    var bounds = new google.maps.LatLngBounds();
    var len = results.list.length;
    var nameArr = [];
    var ctr = 0;
    for (var k = 0; k < len; k++) {
      var name = results.list[k].name;
      var isduplicate = false;
      // keep it simple - check for duplicate, skip if place is already there
      for (var l = 0; l < nameArr.length; l++) {
        if (nameArr[l].valueOf() === name.valueOf()) {
          isduplicate = true;
          break;
        }
      }
      if (isduplicate)
        continue;
      nameArr[ctr] = name;
      ctr++;
      // add to placeList
      viewModel.placeList.push(name);
      var lat = results.list[k].coord.lat;
      var lng = results.list[k].coord.lon;
      var temp = results.list[k].main.temp;
      var tempmax = results.list[k].main.temp_max;
      var tempmin = results.list[k].main.temp_min;

      var contentString = "<div id = 'content'> <h2>" + name + "</h2>" + "<p>Coordinates: " + lat + "(lat), " + lng + "(long) </p>" + "<p> Current Temperature (in celsius): " + temp + ", " + tempmax + " (max), " + tempmin + " (min) </p></div>";

      var tempstr = "{\"name\": " + "\"" + name + "\"" + ", \"lat\": " + lat + ", \"lng\": " + lng + ", \"temp\": " + temp + ", \"tempmax\": " + tempmax + ", \"tempmin\": " + tempmin + "}";

      self.clickedplace = ko.observable(name);
      var obj = JSON.parse(tempstr);
      viewModel.listViewList.push(obj);

      var helperData = {
        latitude: lat,
        longitude: lng,
        title: name,
        data: contentString,
        bounds: bounds,
        temperature: temp
      };
      // Add markers to map
      addMarker(map, helperData);
    }
    resetMarkerColors(map);
    map.fitBounds(bounds);
  }
  // Uses jquery-ui library to autocomplete for suggestions
  processFilterView(viewModel);
};



// Add markers to map
var addMarker = function(currentmap, helperData) {

  var myLatLng = new google.maps.LatLng(helperData.latitude, helperData.longitude);

  var marker = new google.maps.Marker({
    map: currentmap,
    title: helperData.title,
    position: myLatLng,
    data: helperData.data,
    infowindow: null,
    temperature: helperData.temperature
  });
  marker.addListener('click', toggleBounce);
  // Create a marker for each place.
  currentmap.markers.push(marker);

  if (searchPlace.indexOf(helperData.title) > -1) {
    searchPlaceTemp = helperData.temperature;
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
  }
  helperData.bounds.extend(myLatLng);
};

// Go through added markers array and set the icons as per the temperature
var resetMarkerColors = function(currentmap) {

  currentmap.markers.forEach(function(currentmarker) {

    if (currentmarker.temperature === searchPlaceTemp)
      currentmarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    else if (currentmarker.temperature > searchPlaceTemp)
      currentmarker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    else
      currentmarker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
  });
};

var processFilterView = function(viewModel) {
  // Uses jquery-ui library to autocomplete for suggestions
  $("#filterView").autocomplete({

    source: viewModel.placeList(),
    close: function(event, ui) {
      if (viewModel.selectedPlace() === "") {
        viewModel.filterResults("", event);
      }
    },
    select: function(event, ui) {
      if (ui.item.value !== null) {
        viewModel.filterResults(ui.item.value, event);
        var locationSelected = [];
        locationSelected.push(ui.item.value);
        viewModel.filterListViewResults(locationSelected);
      } else
        viewModel.filterResults("", event);

    },
    open: function(event, ui) {
      filterPlaces = [];
      $.each($('.ui-autocomplete > li'), function(index, item) {
        filterPlaces.push(item.firstChild.nodeValue);
      });
      viewModel.filterMarkers(filterPlaces);
      viewModel.filterListViewResults(filterPlaces);
    }
  });
};

//infowindow function that displays coordinates and current temperature
var InfoWindow = (function() {
  var instance;

  function createInstance() {
    var infowindow = new google.maps.InfoWindow({});
    return infowindow;
  }
  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();


function toggleBounce() {
  var marker = this;
  var infowindow = InfoWindow.getInstance();
  // iterate all markers, stop animation and close info window
  //  if it is not current marker and if it is bouncing already
  map.markers.forEach(function(currentmarker) {
    if (currentmarker != marker) {
      if (currentmarker.getAnimation() === google.maps.Animation.BOUNCE)
        currentmarker.setAnimation(null);
      map.setCenter(marker.getPosition());
    }
  });
  infowindow.setContent(marker.data);
  infowindow.close();
  if (marker.getAnimation() !== null && marker.getAnimation() === google.maps.Animation.BOUNCE) {
    marker.setAnimation(null);
    marker.infowindow = infowindow;
    marker.infowindow.close();
  } else {
    // marker stops after 5 secs
    window.setTimeout(function() {
      marker.setAnimation(null);
    }, 5000);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    marker.infowindow = infowindow;
    marker.infowindow.open(map, marker);
    marker.infowindow = infowindow;
  }
}

// View model init
var viewModel = function(initialLocation) {

  var self = this;
  self.placeList = ko.observableArray();
  self.currentplace = ko.observable(initialLocation);
  self.clickedplace = ko.observable();
  self.selectedPlace = ko.observable("");
  self.listViewList = ko.observableArray();
  self.listViewSelectedPlace = ko.observable("");
  self.onSearch = function(data, event) {
    self.placeList.removeAll();
    if (event.keyCode === 13) {
      // Get weather from OpenWeatherMap for this location
      callWeatherAPI(self);
    }
    return true;
  };
  self.listViewListClick = function(data, event) {
    self.filterResults(data.name, event);
  };

  self.filterMarkers = function(filterPlaces) {
    var len = filterPlaces.length;

    map.markers.forEach(function(currentmarker) {
      currentmarker.setVisible(false);
    });

    for (var k = 0; k < len; k++) {
      var currentlocation = filterPlaces[k];
      self.displaySelectedMarker(currentlocation);
    }
  };

  self.displaySelectedMarker = function(location) {
    map.markers.forEach(function(currentmarker) {
      if (currentmarker.title === location)
        currentmarker.setVisible(true);
    });
  };

  self.filterListViewResults = function(filterPlaces) {
    var len = filterPlaces.length;
    if (len === 0) {
      for (var j = 0; j < self.listViewList().length; j++) {
        var classtoshow = self.listViewList()[j].name;
        $("." + classtoshow).show();
        $("." + classtoshow.split(' ').join('.')).show();
      }
      return;
    }

    for (var jj = 0; jj < self.listViewList().length; jj++) {
      var classtohide = self.listViewList()[jj].name;
      $("." + classtohide).hide();
      $("." + classtohide.split(' ').join('.')).hide();
    }


    for (var k = 0; k < len; k++) {
      var currentlocation = filterPlaces[k];
      $("." + currentlocation).show();
      $("." + currentlocation.split(' ').join('.')).show();
    }
  };

  self.filterResults = function(data, event) {
    var filterloc = data;
    // make sure this method is coming from Jquery select event,
    // if so, assign the selected place from dropdown to self.selectedPlace
    if (!(data instanceof ko.observable)) {
      self.selectedPlace = ko.observable(data);
      sourcejquery = true;
    }
    // Markers array hide/show
    // Resultsbox - go thru child nodes of
    var map = self.map; {
      // Go through each marker for all places
      map.markers.forEach(function(marker) {

        // If no place is selected in listbox and enter key is pressed
        if (self.selectedPlace() === '') {
          // If a previous marker is already bouncing close it and its info
          if (marker.getAnimation() !== null &&
            marker.getAnimation() === google.maps.Animation.BOUNCE) {
            marker.setAnimation(null);
            marker.infowindow.close();
          }
          // Display the marker in its stationary state for each place
          marker.setVisible(true);

          for (var j = 0; j < self.listViewList().length; j++) {
            var classtoshow = self.listViewList()[j].name;
            $("." + classtoshow).show();
            $("." + classtoshow.split(' ').join('.')).show();
          }

          // If selected listbox place is not equal to existing marker
        } else if (self.selectedPlace() != marker.title) {
          // If existng marker is bouncing stop bounce and close info
          if (marker.getAnimation() !== null &&
            marker.getAnimation() === google.maps.Animation.BOUNCE) {
            marker.setAnimation(null);
            marker.infowindow.close();
          }
          // and set marker not visible
          //marker.setVisible(false);
          // If selected place matches with place of marker array,
          // display marker and  click triggers togglebBounce  method
        } else {
          marker.setVisible(true);
          if (marker.getAnimation() !== null &&
            marker.getAnimation() === google.maps.Animation.BOUNCE) {
            // same place selected and it is already bouncing, do nothing
          } else
            google.maps.event.trigger(marker, 'click');
        }
      });
    }
    return true;
  };
  // End - Intialization
};

var initialPlace = "Vancouver, BC, CA";
var viewModelObject = new viewModel(initialPlace);
ko.applyBindings(viewModelObject);