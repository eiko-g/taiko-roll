"use strict";
console.log('script.js loaded');
let songList;
$.ajax({
    type: "GET",
    url: "./data/lite.json",
    dataType: "json",
    success: function (response) {
        songList = response;
        console.log(songList);
    }
});