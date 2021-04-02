/* =====================
Leaflet Configuration
===================== */

var mapOpts = {
    center:[29.76045, -95.36978], // set map centered around Houston
    zoom: 11
}

var map = L.map('map', mapOpts);

map.initialBounds = map.getBounds() // record the initial bounds for 

  var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);


  /* ===========================
Event Functions Configuration
============================= */

var nextPage = function(){
    // event handling for proceeding forward in slideshow
}


var prevPage = function(){
    // event handling for going backward in slideshow
}


var buildPage = function(){
    // build up a "slide" given a page definition
}


var tearDown = function(){
    // remove all plotted data in prep for building the page with new filters etc
}


var homePage = function(){
    // remove all plotted data and return to the initial map
}


  /* =================
Pages Configuration
=================== */

var data;
var markers;
var slides = [
    page1,
    page2,
    page3
]