/*
滑动条 slider 的思路:
  1, 通过 鼠标的动作(mousedown mouseup mousemove mouseleave) 绑定事件, 监测鼠标
  移动的位移, 获取滑动条的长度, 通过函数计算得到音量的相对坐标 .
  2, 根据音量坐标计算出相对于整个滑动条的百分比, 用这个百分比来设置 audio的音量以及
  音量条的样式(height/width)
*/

var player = e('#id-audio-player')


// 计算元素相对于浏览器窗口的坐标的函数
var getElementViewLeft = function(element) {
    var actualLeft = element.offsetLeft
    var current = element.offsetParent
    while (current !== null) {
        actualLeft += current.offsetLeft
        current = current.offsetParent
    }
    var elementScrollLeft = document.documentElement.scrollLeft
    return actualLeft - elementScrollLeft
}

// 音量改变的事件
var changeVolume = function(percent) {
    var slider = e('.BB-volume-slider')
    var sliderLength = slider.offsetWidth
    player.volume = percent
    var bar = e('.BB-volume-bar')
    bar.style.width = percent * 100 + '%'
    var circle = e('.BB-volume-circle')
    // $('.BB-volume-circle').position({left: 20 * percent + 43})
    // log(bar.offsetLeft, (20 * percent + 43), 'percent',percent)
    // circle.style.left = '50px +' + percent * 100
    circle.style.left =  (percent * sliderLength - 11) + 'px'

}
var bindEventChangeVolume = function() {
    // 预设 鼠标事件的标记(down) 为false
    var down = false
    var slider = e('.BB-volume-slider')
    log(slider)
    var changePercent = function() {
        var sliderLength = slider.offsetWidth
        var percent = (event.clientX - getElementViewLeft(slider)) / sliderLength
        percent = percent > 0 ? percent : 0
        percent = percent < 1 ? percent : 1
        changeVolume(percent)
    }
    bindEvent(slider, 'mousedown', function(){
        down = true
        changePercent()
    })
    bindEvent(slider, 'mouseup', function(){
        down = false
    })
    bindEvent(slider, 'mouseleave', function(){
        down = false
    })
    bindEvent(slider, 'mousemove', function(){
        if(down) {
          changePercent()
        }
    })
}
bindEventChangeVolume()

// 时间改变的事件
var changeTimeBar = function(percent) {
    var bar = e('.BB-time-bar')
    bar.style.width = percent * 100 + '%'
    var t = player.duration * percent
    player.currentTime = t
}

var bindEventChangeTime = function() {
    // 预设 鼠标事件的标记(down) 为false
    var down = false
    var slider = e('.BB-time-slider')
    log(slider)
    var changePercent = function() {
        var sliderLength = slider.offsetWidth
        var percent = (event.clientX - getElementViewLeft(slider)) / sliderLength
        percent = percent > 0 ? percent : 0
        percent = percent < 1 ? percent : 1
        changeTimeBar(percent)

        player.play()
        // 改变 "播放/暂停" 按钮的显示
        var play = e('#id-a-play')
        var pause = e('#id-a-pause')
        play.classList.add('BB-hide')
        pause.classList.remove('BB-hide')
    }
    bindEvent(slider, 'mousedown', function(){
        down = true
        changePercent()
    })
    bindEvent(slider, 'mouseup', function(){
        down = false
    })
    bindEvent(slider, 'mouseleave', function(){
        down = false
    })
    bindEvent(slider, 'mousemove', function(){
        if(down) {
          changePercent()
        }
    })
}
bindEventChangeTime()
