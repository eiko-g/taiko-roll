"use strict";
console.log('script.js loaded');
let songList;
$(document).ready(function () {
    // 载入歌单
    $.ajax({
        type: "GET",
        url: "./data/lite.json",
        dataType: "json",
        success: function (response) {
            songList = response;
            console.log(songList);
        }
    });

    // 设置相关
    $(document).on('click', '#option-button', function () {
        $('.option-main').addClass('show');
    });
    $(document).on('submit', '#option-form', function () {
        $('.option-main').removeClass('show');
        return false;
    });
});