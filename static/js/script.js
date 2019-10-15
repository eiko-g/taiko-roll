"use strict";
console.log('script.js loaded');
let
    songList,
    option = {};
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
        let formDataArray = $(this).serializeArray();
        console.log(formDataArray);
        let temp = formDataArray.filter(item => item.name == 'level');
        console.log(temp);
        option.levels = [];
        temp.map(item => option.levels.push(item.value));
        console.log(option.levels);
        if (option.levels.length !== 0) {
            $('#option-show-level').text(option.levels.join('、'));
        } else {
            $('#option-show-level').text('未设置');
        }

        option.levelMin = formDataArray.find(item => item.name == "level-num-min").value;
        $('#option-show-level-num-min').text(option.levelMin);
        option.levelMax = formDataArray.find(item => item.name == "level-num-max").value;
        $('#option-show-level-num-max').text(option.levelMax);

        $('.option-main').removeClass('show');
        return false;
    });
});