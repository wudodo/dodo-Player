var log = function() {
    console.log.apply(console, arguments)
}

// var fs = require('fs')
// var path = require('path')

var player = e('#id-audio-player')
var playMode = 'loop'

// path.join 函数可以规范路径, 所有音乐文件都存在 audios文件夹
// var audioDir = path.join('audios')

// 载入 audios 歌曲文件生成歌单
// var loadList = function() {
//     fs.readdir(audioDir, function(error, files){
//         log(files, files.length)
//
//         // 设置 audio元素 的歌曲数
//         $('#id-audio-player').attr('data-sum', files.length)
//
//         // 播放列表的 html模板
//         var songTemplate = function(song) {
//             var t = `
//                 <li class='BB-song' data-index='0'>
//                     <a href="#">${song}</a>
//                 </li>
//             `
//             return t
//         }
//         // 处理files, 把歌曲名去掉后缀
//         for (var i = 0; i < files.length; i++) {
//             files[i] = files[i].split('.')[0]
//         }
//
//         // 生成播放列表并插入页面
//         var songs = files.map(songTemplate)
//         $('#id-ul-song-list').append(songs)
//         // 设置每首歌的 data-index 和 id
//         var songsHtml = es('.BB-song')
//         for (var i = 0; i < songsHtml.length; i++) {
//             var s = songsHtml[i]
//             s.dataset.index = i
//             s.id = `id-li-song-${i}`
//         }
//     })
// }
//

// 歌曲 src转换
var srcInsert = function() {
    var src = player.src
    var info = src.split('/').splice(-1)[0].split('.')[0]
    var str = decodeURI(info)
    var author = str.split('-')[0]
    author = author.slice(0, author.length-1)
    var name = str.split('-')[1]
    name = name.slice(1)
    log(src)
    // var result = []
    // result.push(name)
    // result.push(author)
    // return result

    // 插入页面
    var nameSpan = e('.BB-song-name')
    var authorSpan = e('.BB-song-author')
    nameSpan.innerHTML = author
    authorSpan.innerHTML = name
}

// 所有事件
var bindEvents = function() {
    // 给播放列表中的歌曲名绑定事件
    $('#id-ul-song-list').on('click', 'a', function(){
        var target = event.target
        var filepath = path.join('audios', target.innerText) + '.mp3'
        // 这步是精髓
        player.src = filepath

        // 改变 audio 中的 data-index
        var index = target.parentElement.dataset.index
        player.dataset.index = index
        player.play()
    })

    // 给 "播放/暂停" 按钮绑定事件
    $('#id-a-pause').on('click', function(){
        player.pause()
        var pause = e('#id-a-pause')
        var play = e('#id-a-play')
        toggleClass(pause, 'BB-hide')
        play.classList.remove('BB-hide')
    })
    $('#id-a-play').on('click', function(){
        player.play()
        var play = e('#id-a-play')
        var pause = e('#id-a-pause')
        toggleClass(play, 'BB-hide')
        pause.classList.remove('BB-hide')
        srcInsert()
    })

    // 给"下一首" 绑定事件(与上一首在一起)
    $('.BB-audio-control').on('click', function(){
        var target = event.target
        // 获取当前 audio 中的 data-index和data-sum, 计算
        var offset = parseInt(target.dataset.offset)
        var sum = parseInt(player.dataset.sum)
        var active = parseInt(player.dataset.index)
        var nextIndex = (active + offset + sum) % sum
        // 改变 当前audio的index
        player.dataset.index = nextIndex
        // 找到下一首歌曲并播放
        var name = $(`#id-ul-song-${nextIndex}`).find('a').text()
        var filepath = 'audios/' + name + '.mp3'
        player.src = filepath
        log(filepath)
        player.play()

        // 改变 "播放/暂停" 按钮的显示
        var play = e('#id-a-play')
        var pause = e('#id-a-pause')
        play.classList.add('BB-hide')
        pause.classList.remove('BB-hide')

        // 更换歌曲信息
        srcInsert()
    })

    // 绑定 span标签的 "歌曲时间"事件
    $(player).on('canplay', function(){
        var m = Math.floor(player.duration / 60)
        var s = Math.floor(player.duration % 60)
        if(s < 10) {
            s = '0' + s
        }
        var d = e('#id-span-duration')
        d.innerHTML = `${m}: ${s}`
    })
    $(player).on('canplay', function(){
        var c = e('#id-span-current')
        setInterval(function(){
            // 注意 把 t 的赋值放到setInterval里面来, 才能不断获得t的最新值
            var m = Math.floor(player.currentTime / 60)
            var s = Math.floor(player.currentTime % 60)
            s = s < 10 ? '0' + s : s
            c.innerHTML = `${m}: ${s}`
        }, 1000)

    })

    // 进度条显示事件
    $(player).on('canplay', function(){
        var changTime = function() {
            var percent = player.currentTime / player.duration
            var bar = e('.BB-time-bar')
            bar.style.width = percent*100 + '%'
        }
        setInterval(changTime, 100)
    })

    // 音量按钮 "静音 / 最大" 事件
    $('.BB-volume-max').on('click', function(){
        // currentVolume 只有在点击'静音'按钮时 才会被重新赋值
        window.currentVolume = player.volume
        player.volume = 0
        $('.BB-volume-max').addClass('BB-hide')
        $('.BB-volume-min').removeClass('BB-hide')
    })
    $('.BB-volume-min').on('click', function(){
        player.volume = currentVolume
        $('.BB-volume-min').addClass('BB-hide')
        $('.BB-volume-max').removeClass('BB-hide')
    })

    // "红心" 事件
    $('#id-a-list-nolike').on('click', function(){
        $('#id-a-list-nolike').addClass('BB-hide')
        $('#id-a-list-like').removeClass('BB-hide')
    })
    $('#id-a-list-like').on('click', function(){
        $('#id-a-list-like').addClass('BB-hide')
        $('#id-a-list-nolike').removeClass('BB-hide')
    })


}


var __main = function() {
    // loadList()
    bindEvents()
}
__main()
