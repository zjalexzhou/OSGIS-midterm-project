/* =====================
Leaflet Configuration
===================== */

var mapOpts = {
    center:[29.86045, -95.36978], // set map centered around Houston
    zoom: 10
}

var map = L.map('map', mapOpts);
map.initialBounds = map.getBounds(); // record the initial bounds mapped

var tileOpts = {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
};

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', tileOpts).addTo(map);

  /* ===========================
Event Functions Configuration
============================= */

var nextPage = function(){
    // event handling for proceeding forward in slideshow
    currentPage += 1;
    tearDown();
    buildPage(slides[currentPage]);
}


var prevPage = function(){
    // event handling for going backward in slideshow
    currentPage -= 1;
    tearDown();
    buildPage(slides[currentPage]);
}


var buildPage = function(pageDefinition){
    // build up a "slide" given a page definition
    
    $('#title').text(pageDefinition.title);
    $('#content').text(pageDefinition.content);
    $('#method').text(pageDefinition.method);
    $('#legend-title').text(pageDefinition.legendTitle)

    if(currentPage === 0){
        $('#button-prev').prop("disabled", true);
    } else {
        $('#button-prev').prop("disabled", false);
    }

    if(currentPage === slides.length-1){
        $('#button-next').prop("disabled", true);
    } else {
        $('#button-next').prop("disabled", false);
    }

    if(pageDefinition.title === "High Park Demand"){
        $('#leg').hide();
    } else {
        $('#leg').show();
    }

    if(pageDefinition.filter === undefined){
        theFilter = function() {return true};
    } else {
        theFilter = pageDefinition.filter;
    }

    featureGroup = L.geoJson(data, {
        style: pageDefinition.style,
        filter: theFilter
    }).addTo(map);

    featureGroup.eachLayer(eachFeatureFunction);

}


var tearDown = function(){
    // remove all plotted data in prep for building the page with new filters etc
    map.removeLayer(featureGroup)
}


var homePage = function(){
    // remove all plotted data and return to the initial map
    tearDown();
    currentPage = 0;
    buildPage(slides[currentPage]);
    removeMarkers();
    fullExtent();
}


var fullExtent = function(){
    map.fitBounds(map.initialBounds);
}


var removeMarkers = function(){
    map.removeLayer(arbitraryMarker)
    map.closePopup();
  }


  /* =====================
Data Path Configuration
======================= */

var dataPath = 'https://raw.githubusercontent.com/zjalexzhou/OSGIS-midterm-project/main/houstonParkAccess.geojson';

  /* =================
Pages Configuration
=================== */

var data;
// var markers;
var featureGroup;
var currentPage = 0;

var page1 = {
    title: "Park Access",
    content: "\"In these challenging times, access to the outdoors is more important than ever. And yet, across the country, more than 100 million people don't have a park within a 10-minute walk of home.\"\n\nThe first map presents the percentage of area covered by the 10-minute-walk service areas of parks for each census tract in Houston, TX.",
    method:"Area ratio served equals the area of land within the 10-min-walk serving area of current parks divided by the total area of the region. Tract-level data are roughly classified into HIGH, MEDIUM, and LOW according to the data distribution (MEAN+/-1SD).",
    style: function(feature) {
        switch (feature.properties.RANK_AreaServedRatio) {
          case 'Medium': return {color: "blue"};
          case 'Low': return {color: "red"};
          case 'High': return {color: "green"};
          default: return {color: 'black'} // for tracts containing NA data
        }
      }, 
    legendTitle: "Area% Served by Public Parks"
}

var page2 = {
    title: "Population Density",
    content: '\"Close-to-home opportunities to exercise and experience nature are essential for our physical and mental well-being. Studies show that parks encourage physical activity, reduce crime, revitalize local economies, and help bring neighborhoods together.\"',
    method: "Population density is calculated as the population per acre using the 2018 ACS-5-YR estimates. Tract-level data are roughly classified into HIGH, MEDIUM, and LOW according to the data distribution (MEAN+/-1SD).",
    style: function(feature) {
        switch (feature.properties.RANK_PopDensity) {
          case 'Medium': return {color: "blue"};
          case 'Low': return {color: "red"};
          case 'High': return {color: "green"};
          default: return {color: 'black'} // for tracts containing NA data
        }
      }, 
    legendTitle: "Population Density"
};

var page3 = {
    title: "High Park Demand",
    content: '\"Creating new parks is important, but acquiring land is only one of many strategies to improve park systems. In some cases, a city can increase its ParkScore rating by adding new park entrances or creating safe routes around obstacles like waterways and busy streets.\"',
    method: "Filtered tracts with LOW Park Access but HIGH Population Density which...may become optimal locations for a new park. This is a demo showing tracts with high park demand only.",
    style: function(){
        return {color: 'Purple'}
    },
    filter: function(feature){
        return(feature.properties.RANK_PopDensity === 'High' & feature.properties.RANK_AreaServedRatio === 'Low')
    },
};

var page4 = {
    title: "Customized Viz",
    content: "ss"
}

var slides = [
    page1,
    page2,
    page3
]


  /* ========
Layer View
========== */


// specify popup options 
var customOptions =
    {
    'maxWidth': '500',
    'className' : 'custom'
    }

arbitraryMarker = [];
var eachFeatureFunction = function(layer) {
    layer.on('click', function (event) {
        // removeMarkers();
        // arbitraryMarker = L.marker(event.latlng).bindPopup(customPopup,customOptions);// {icon: greenIcon});
        // arbitraryMarker.addTo(map);

        // create popup contents
        var customPopup = layer.feature.properties.NAME + "<br>GEOID: "+layer.feature.properties.GEOID+"<br><br>"+"<strong>Park Access</strong>"+
        "<br>" + (layer.feature.properties.AreaServedRatio*100).toFixed(2)+'% Area Served by a Public Park' + 
        "<br>" + (layer.feature.properties.ParkAreaRatio*100).toFixed(2)+'% Area Covered by a Public Park' + "<br>"+"<strong>Demographics & Economics</strong>"+
        "<br>" + (layer.feature.properties.PopDensity.toFixed(2))+' People Per Acre Land' +
        "<br>" + (layer.feature.properties.HHInc30PercOnRentRate*100).toFixed(2)+'% Households Spend 30%+ Income on Rent' +
        "<br>" + (layer.feature.properties.ChildAndYoundAdultsRate*100).toFixed(2)+'% Young Population (Age<25)' +
        "<br>" + (layer.feature.properties.SeniorCitizenRate*100).toFixed(2)+'% Senior Citizen (Age>=65)' + "<br>" + "<strong>Health</strong>"+
        "<br>" + (layer.feature.properties.lifeExpectancy)+'yrs ~ Local Avg. Life Expectancy' + 
        "<br>" + (layer.feature.properties.poorMentalHealthRate*100).toFixed(2)+'% Population w/ Mental Health Issues' + 
        "<br>" + (layer.feature.properties.sedentationRate*100).toFixed(2)+'% Sedentary Population';
        var pop= L.popup().setLatLng(event.latlng).setContent(customPopup).openOn(map);
        // Zoom to a particular feature when clicked
        map.fitBounds(event.target.getBounds());
    console.log(layer)
    })
}


  /* ========
Main Call
========== */

$.ajax(dataPath).done(function(json){
    data = JSON.parse(json)
    buildPage(slides[currentPage]);
})