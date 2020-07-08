"use strict";
console.log('script.js 已载入');

/**
 * Doc Ready
 * 就是 $.(document).ready(function(){})
 */
function docReady(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

/**
 * Get Element
 * 就是 $(element)
 */
function getEl(element) {
    let tempEl;
    switch ([...element][0]) {
        case '#':
            tempEl = document.querySelectorAll(element)[0];
            break;
        default:
            tempEl = document.querySelectorAll(element);
    };
    return tempEl;
}

/**
 * My ajax
 * 自写的一个稀烂的 Ajax 函数
 */
function myAjax({
    method = 'GET',
    url = undefined,
    data,
    async = true,
    user = null,
    password = null,
    type = '',
    done = () => { },
    fail = () => { },
    always = () => { },
    error = () => { },
    timeout = undefined,
    timeoutEvent = () => { },
    beforeSend = () => { },
}) {

    let xhr = new XMLHttpRequest();
    xhr.open(method, url, async, user, password);
    xhr.responseType = type;
    beforeSend(this);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            done(this);
        } else {
            fail(this);
        }
        always(this);
    }
    xhr.onerror = function () {
        error(this);
        always(this);
    }
    timeout = Number(timeout);
    if (!Number.isNaN(timeout) && Number.isInteger(timeout)) {
        xhr.timeout = timeout;
        xhr.ontimeout = function () {
            timeoutEvent(this);
            xhr.abort();
            always(this);
        }
    }
    if (data) {
        xhr.send(data);
    } else {
        xhr.send();
    }
};
// 下面才是正文
let 临时输出;
// 打乱数组，来自：https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function 抽取(最小值, 最大值) {
    let 抽取数 = 最大值 - 最小值 + 1;
    return Math.floor(Math.random() * 抽取数 + 最小值);
}
// 来自：https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
docReady(() => {
    let
        设置 = {},
        载入的JSON = [],
        抽奖歌单 = [],
        歌单名 = {
            'taiko14old': '旧框14旧基准',
            'taiko14new': '旧框14【新】基准',
            'taikomomoiroSP': '摸摸衣裸SP',
            'taikoRedSP': '红SP'
        },
        分类名 = {},
        难度文字 = {
            'easy': '梅',
            'normal': '竹',
            'hard': '松',
            'oni': '鬼'
        };
    //#region 载入歌单
    function 载入歌单(文件名, 版本 = 1) {
        let 载入次数;
        myAjax({
            type: 'GET',
            url: './data/' + 文件名 + '.json?ver=' + 版本,
            timeout: 10000,
            type: 'json',
            done: (data) => {
                console.log(data.response);
                载入的JSON[文件名] = data.response;
                console.log('载入的JSON:', 载入的JSON);
            },
            fail: () => {
                if (载入次数 < 10) {
                    载入次数++;
                    载入歌单(文件名, 版本);
                    console.log('载入文件失败：' + 文件名 + '（' + 版本 + '），失败次数：' + 载入次数);
                } else {
                    alert(文件名 + '.json' + '（' + 版本 + '）' + '载入失败次数过多，请刷新页面重试');
                    载入次数 = 0;
                }
            }
        });
    }
    // 载入歌单('taiko14old', 1);
    载入歌单('taiko14new', 2020070901);
    // 载入歌单('taikomomoiroSP', 20191130);
    载入歌单('taikoRedSP', 2020070901);
    // 载入歌单('error', 123);
    //#endregion

    let
        Roll歌按钮 = getEl('#roll-button');
    // 有时候禁止点击会抽筋，直接再禁一次
    Roll歌按钮.setAttribute('disabled', 'disabled');

    let 设置按钮 = getEl('#option-button');
    // 点击就显示设置框
    设置按钮.addEventListener('click', () => {
        getEl('.option-main')[0].classList.add('show');
    });
    let 表单 = getEl('#option-form');
    // 这里用提交来保存设置
    表单.addEventListener('submit', function (event) {
        // 获取表单数据
        let
            表单数据 = new FormData(this);
        console.log('表单数据：', 表单数据);

        // 清空一下设置，不然会有残留
        设置 = {};
        // 把 formData 提取出来，不然不能直接用
        for (let [key, value] of 表单数据.entries()) {
            设置[key] = value;
        }
        // 关窗
        getEl('.option-main')[0].classList.remove('show');
        // 让用户可以抽奖
        Roll歌按钮.removeAttribute('disabled');

        console.log('设置：', 设置);

        // 显示各种信息
        getEl('#option-show-songlist').textContent = 歌单名[设置.歌单];
        getEl('#option-show-difficulty').textContent = 难度文字[设置.难度];
        getEl('#option-show-level-num-min').textContent = 设置.最低等级;
        getEl('#option-show-level-num-max').textContent = 设置.最高等级;

        // 设置分类名
        分类名 = 载入的JSON[设置.歌单].分类;

        // 筛选歌曲
        抽奖歌单 = 载入的JSON[设置.歌单].歌单;
        console.log('筛选前的抽奖歌单：', 抽奖歌单);
        // 抽歌条件
        function 筛选歌单(歌曲) {
            return (歌曲.等级[设置.难度] >= 设置.最低等级) && (歌曲.等级[设置.难度] <= 设置.最高等级);
        }
        // 筛！
        抽奖歌单 = 抽奖歌单.filter(筛选歌单);
        // 打乱一下歌单，避免浏览器的伪随机影响
        shuffleArray(抽奖歌单);
        console.log('筛选后的抽奖歌单：', 抽奖歌单);

        // 禁掉表单的提交动作，不然就刷新页面了
        event.preventDefault();
        return false;
    });

    // Roll 歌！
    Roll歌按钮.addEventListener('click', () => {
        console.log('Roll!');
        // 禁它.jpg
        Roll歌按钮.setAttribute('disabled', 'disabled');
        let A = 0;
        // Roll 歌动作
        function 抽取歌曲() {
            let 随机数, 抽到的歌;
            随机数 = 抽取(0, 抽奖歌单.length - 1);
            抽到的歌 = 抽奖歌单[随机数];
            console.log(抽到的歌);

            // 显示歌曲内容
            getEl('#result-name').textContent = 抽到的歌.曲名;
            getEl('#result-name-cn').textContent = 抽到的歌.注释;
            getEl('#result-category').textContent = 分类名[抽到的歌.分类];
            getEl('#result-level-name').textContent = 难度文字[设置.难度];
            getEl('#result-level-num').textContent = 抽到的歌.等级[设置.难度];

            // 抽完之后把按钮还原
            A++;
            console.log('A:', A);
            if (A > 50) {
                Roll歌按钮.removeAttribute('disabled');
                // 再打乱一次歌单
                shuffleArray(抽奖歌单);
                console.log('更新后的歌单：', 抽奖歌单);
                A = 0;
            }
        }

        // 抽我.jpg
        for (let a = 0; a <= 50; a++) {
            setTimeout(抽取歌曲, 50 * a);
        }
    });
});