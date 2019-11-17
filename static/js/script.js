"use strict";
console.log('script.js loaded');
let
    songList = {},
    option = {},
    difficultyText = {
        'easy': '梅',
        'normal': '竹',
        'hard': '松',
        'oni': '鬼'
    },
    songListText = {
        'taiko14old': '旧框14旧基准',
        'taiko14new': '旧框14【新】基准',
        'taikomomoiroSP': '摸摸衣裸SP'
    },
    temp;
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
    loadSongList('taiko14old');
    loadSongList('taiko14new');
    loadSongList('taikomomoiroSP');
    // loadSongList('errortest');

    // 设置相关
    $(document).on('click', '#option-button', function () {
        $('.option-main').addClass('show');
    });
    $(document).on('submit', '#option-form', function () {
        let formDataArray = $(this).serializeArray();
        console.log(formDataArray);
        let temp = formDataArray.filter(item => item.name == 'level');
        console.log(temp);

        // 曲目难度
        option.difficulty = [];
        temp.map(item => option.difficulty.push(item.value));
        console.log(option.difficulty);
        if (option.difficulty.length !== 0) {
            $('#option-show-difficulty').text(difficultyText[option.difficulty]);
        } else {
            $('#option-show-difficulty').text('未设置');
        }

        // 曲目等级
        option.levelMin = formDataArray.find(item => item.name == "level-num-min").value;
        $('#option-show-level-num-min').text(option.levelMin);
        option.levelMax = formDataArray.find(item => item.name == "level-num-max").value;
        $('#option-show-level-num-max').text(option.levelMax);

        // 歌单选择
        option.songListSelected = formDataArray.find(item => item.name == "songlist-select").value;
        if (option.songListSelected.length !== 0) {
            $('#option-show-songlist').text(songListText[option.songListSelected]);
        } else {
            $('#option-show-songlist').text('未设置');
        }

        $('.option-main').removeClass('show');
        $('#roll-button').prop('disabled', false);
        return false;
    });

    // 抽奖
    function selectFrom(lowerValue, upperValue) {
        let choices = upperValue - lowerValue + 1;
        return Math.floor(Math.random() * choices + lowerValue);
    }
    $(document).on('click', '#roll-button', function () {
        console.log('Roll!');
        $('#roll-button').prop('disabled', true);
        let selectedSong, theA = 0;
        function rollSong() {
            let random = selectFrom(0, songList[option.songListSelected].songList.length - 1);
            selectedSong = songList[option.songListSelected].songList[random];
            console.log(selectedSong);
            temp = selectedSong;
            if (selectedSong.level[option.difficulty] >= option.levelMin && selectedSong.level[option.difficulty] <= option.levelMax) {
                console.log('---');
                console.log(selectedSong);
                $('#result-name').text(selectedSong.name);
                $('#result-name-cn').text(selectedSong.name_cn);
                $('#result-category').text(selectedSong.category);
                $('#result-level-name').text(difficultyText[option.difficulty]);
                $('#result-level-num').text(selectedSong.level[option.difficulty]);
                theA++;
                console.log(theA);
                if (theA > 50) {
                    $('#roll-button').prop('disabled', false);
                    theA = 0;
                }
            } else {
                console.log('Roll fail');
                rollSong();
            }
        }
        for (let a = 0; a <= 50; a++) {
            setTimeout(rollSong, 50 * a);
        }
    });
});