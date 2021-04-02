/* =====================
Leaflet Configuration
===================== */

var mapOpts = {
    center:[29.86045, -95.36978], // set map centered around Houston
    zoom: 10
}

var map = L.map('map', mapOpts);

// map.initialBounds = map.getBounds(); // record the initial bounds mapped

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
    featureGroup = L.geoJson(data, {
        style: pageDefinition.style
    }).addTo(map);
    $('#title').text(pageDefinition.title);
    $('#content').text(pageDefinition.content);
    $('#method').text(pageDefinition.method);

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
}

var page2 = {
    title: "Population Density",
    content: 's',
    method: "Population density is calculated as the population per acre using the 2018 ACS-5-YR estimates. Tract-level data are roughly classified into HIGH, MEDIUM, and LOW according to the data distribution (MEAN+/-1SD)."
};

var page3;

var slides = [
    page1,
    page2,
    page3
]


$.ajax(dataPath).done(function(json){
    data = JSON.parse(json)
    buildPage(slides[currentPage]);
})