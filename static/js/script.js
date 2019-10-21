"use strict";
console.log('script.js loaded');
let
    songList = {},
    option = {};
$(document).ready(function () {
    // 载入歌单
    let loadFileCount = 0;
    function loadSongList(fileName) {
        $.ajax({
            type: "GET",
            url: "./data/" + fileName + ".json",
            dataType: "json",
        }).done(
            function (response) {
                console.log(response);
                songList[fileName] = response;
                console.log(songList);
            }
        ).fail(
            function () {
                if (loadFileCount < 10) {
                    loadFileCount++;
                    loadSongList(fileName);
                    console.log('载入文件失败：' + fileName + '，失败次数：' + loadFileCount);
                } else {
                    alert(fileName + '.json 载入失败次数过多，请刷新页面重试');
                    loadFileCount = 0;
                }
            }
        )
    };
    loadSongList('lite');
    loadSongList('taiko14old');
    // loadSongList('test');

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