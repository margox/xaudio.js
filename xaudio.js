/**
 * Web Audio扩展
 * @author Margox
 * @version 0.0.1
 */

(function (factory) {

    /*
     * 添加UMD支持
     */
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.XAudio = factory();
    }

})(function () {

    'use strict';

    function __getRandom(min, max) {
        return Math.floor(min + Math.random() * (max - min));
    }

    function __secToMin(second) {

        var __min = Math.floor(second / 60);
        var __sec = Math.floor(second % 60);

        __sec < 10 && (__sec = "0" + __sec);
        __min < 10 && (__min = "0" + __min);

        return __min + ":" + __sec;

    }

    function __mergeOption() {

        var __result = {}

        Array.prototype.forEach.call(arguments, function (argument) {

            var __prop;
            var __value;

            for (__prop in argument) {
                if (Object.prototype.hasOwnProperty.call(argument, __prop)) {
                    if (Object.prototype.toString.call(argument[__prop]) === '[object Object]') {
                        __result[__prop] = __mergeOption(__result[__prop], argument[__prop]);
                    } else {
                        __result[__prop] = argument[__prop];
                    }
                }
            }

        });

        return __result;

    }

    /**
     * XAudio构造函数
     * @param {Array} list 传入一个播放列数组
     */
    function XAudio(list) {

        if (!(this instanceof XAudio)) {
            return new XAudio(list);
        }

        this.playing = false;

        this.__list = [];
        this.__index = 0;
        this.__mode = 1;
        this.__events = {};
        this.__init(list)
            .__registerAudioEvents();

    }

    XAudio.prototype.__init = function (list) {

        this[0] = new Audio();
        this.list(list);
        this.mode(1);
        this.__list.length && this.index(0);

        return this;

    }

    XAudio.prototype.__registerAudioEvents = function () {

        this[0].addEventListener('loadedmetadata', function () {
            this.trigger('loadedmetadata');
        }.bind(this));

        this[0].addEventListener('ended', function () {
            this.playing = false;
            this.trigger('ended').next(true);
        }.bind(this));

        this[0].addEventListener('play', function () {
            this.playing = true;
            this.trigger('play');
        }.bind(this));

        this[0].addEventListener('pause', function () {
            this.playing = false;
            this.trigger('pause');
        }.bind(this));

        this[0].addEventListener('error', function () {
            this.playing = false;
            this.trigger('error');
        }.bind(this));

        this[0].addEventListener('timeupdate', function () {
            if (this.__events['timeupdate']) {
                this.trigger('timeupdate', this[0].currentTime, this.progress());
            }
        }.bind(this));

        return this;

    }

    XAudio.prototype.__rebuildList = function (list) {

        var __result = [];

        if (Object.prototype.toString.call(list) !== '[object Array]') {
            return false;
        }

        list.forEach(function (item) {
            if (this.__checkItem(item)) {
                __result.push(item);
            }
        }.bind(this));

        return __result;

    }

    XAudio.prototype.__checkItem = function (item) {
        return Object.prototype.toString.call(item.src) === '[object String]';
    }

    /**
     * 设置或者返回播放列表
     * @param  {[Array]} 播放列表数组 [可选，如果不传入任何值，则返回播放列表]
     * @return {Array/Object} 返回播放列表数组，或者返回实例以便于链式调用
     */
    XAudio.prototype.list = function (list) {

        var __list = this.__rebuildList(list);

        if (list !== undefined) {

            if (Object.prototype.toString.call(__list) === '[object Array]') {
                this.__list = __list;
                this.trigger('listchange', this.__list);
                this.trigger('listload', this.__list);
            }
            return this;

        } else {
            return this.__list;
        }

    }

    /**
     * 返回播放列表的长度
     * @return {Number} 列表的长度
     */
    XAudio.prototype.listLength = function () {
        return this.__list.length;
    }

    /**
     * 播放指定Index的音频或者从暂停状态恢复播放
     * @param  {Number} index 选填，指定需要立即播放的音频的index
     * @return {Object} 返回实例已便于链式调用
     */
    XAudio.prototype.play = function (index) {

        this.index(index);
        this[0].play();
        return this;

    }

    /**
     * 播放下一个音频
     * @param  {Boolean} isAuto 选填，单曲模式下，传入true会重新播放当前音频
     * @return {Object} 返回实例以便于链式调用
     */
    XAudio.prototype.next = function (isAuto) {

        var __index = this.__index;

        if (this.__mode === 1) {
            __index = __index === this.__list.length - 1 ? 0 : __index + 1;
        } else if (this.__mode === 2) {
            __index = isAuto ? __index : (__index === this.__list.length - 1 ? 0 : __index + 1);
        } else if (this.__mode === 3) {
            __index = __getRandom(0, this.__list.length);
        }

        this.index(__index);
        this.currentTime(0);
        this.play();

        return this;

    }

    /**
     * 播放上一个音频
     * @return {Object} 返回实例以便于链式调用
     */
    XAudio.prototype.prev = function () {

        var __index = this.__index;

        if (this.__mode === 1) {
            __index = __index === 0 ? this.__list.length - 1 : __index - 1;
        } else if (this.__mode === 2) {
            __index = __index === 0 ? this.__list.length - 1 : __index - 1;
        } else if (this.__mode === 3) {
            __index = __getRandom(0, this.__list.length);
        }

        this.index(__index);
        this.currentTime(0);
        this.play();

        return this;

    }

    /**
     * 停止播放，将播放进度跳转至起始位置
     * @return {Object} 返回实例以便于链式调用
     */
    XAudio.prototype.stop = function () {

        this.pause().currentTime(0);
        this.trigger('stop');
        return this;

    }

    /**
     * 暂停播放
     *  @return {Object} 返回实例以便于链式调用
     */
    XAudio.prototype.pause = function () {

        this[0].pause();
        return this;

    }

    /**
     * 轮流切换播放和暂停状态
     *  @return {Object} 返回实例以便于链式调用
     */
    XAudio.prototype.toggle = function () {

        this.playing ? this.pause() : this.play();
        return this;

    }

    /**
     * 获取或者设置当前播放百分比
     * @param  {Number} progress 0-100之间的数字，可选项，不传入任何值则返回当前播放的百分比
     * @return {Number/Object} 返回当前播放百分比，或者返回实例以便于链式调用
     */
    XAudio.prototype.progress = function (progress) {

        if (progress !== undefined) {

            if (!isNaN(progress) && progress >= 0 && progress <= 100 && this[0].duration > 0) {
                this.currentTime(progress / 100 * this[0].duration);
            }
            return this;

        } else {
            return this[0].duration > 0 ? this[0].currentTime / this[0].duration * 100 : 0;
        }

    }

    /**
     * 返回当前音频时长
     * @param  {Boolean} returnMinutes 是否返回分钟值
     * @return {Number/String} 返回时长或者分钟值
     */
    XAudio.prototype.duration = function (returnMinutes) {
        return returnMinutes ? __secToMin(this[0].duration) : this[0].duration;
    }

    /**
     * 获取或者设置当前播放秒数
     * @param  {Number} time 0或以上的数字，可选项，不传入任何值则返回当前播放秒数,也可以传入true来获取已播放的分钟值
     * @return {Number/Object} 返回当前播放秒数/分钟值，或者返回实例以便于链式调用
     */
    XAudio.prototype.currentTime = function (time) {

        var __time = parseInt(time);

        if (time !== undefined && time !== true) {

            if (!isNaN(__time) && __time >= 0) {
                this.trigger('timechange', __time)[0].currentTime = __time;
            }
            return this;

        } else {
            return time === true ? __secToMin(this[0].currentTime) : this[0].currentTime;
        }

    }

    /**
     * 设置或者获取静音状态
     * @param  {Boolean} mute 传入布尔值来设置静音状态，不传入任何值则返回静音状态
     * @return {Boolean/Object} 返回静音状态布尔值，或者返回实例以便于链式调用
     */
    XAudio.prototype.muted = function (mute) {

        if (mute !== undefined) {
            mute = !!mute;
        }

        if (Object.prototype.toString.call(mute) === '[object Boolean]') {
            this[0].muted = mute;
            this.trigger('muted', mute);
            return this;
        } else {
            return this[0].muted;
        }

    }

    /**
     * 设置或者获取音量值
     * @param  {Number} volume 0-1之间的数字，可选填，不传入则返回当前音量值
     * @return {Number/Object} 返回音量值，或者返回实例以便于链式调用
     */
    XAudio.prototype.volume = function (volume) {

        if (volume !== undefined) {

            if (!isNaN(volume) && volume >= 0 && volume <= 1) {
                this.trigger('volumechange', volume)[0].volume = volume;
            }
            return this;

        } else {
            return this[0].volume;
        }

    }

    /**
     * 设置或者获取音量值
     * @param  {Number} mode 1：列表循环，2：单曲循环,3：随机播放。可选填，不传入则返回当前播放模式
     * @return {Number/Object} 返回当前播放模式，或者返回实例以便于链式调用
     */
    XAudio.prototype.mode = function (mode) {

        var __mode = parseInt(mode);

        if (mode !== undefined) {

            if (__mode === 1 || __mode === 2 || __mode === 3) {
                this.trigger('modechange', __mode).__mode = __mode;
            }
            return this;

        } else {
            return this.__mode;
        }

    }

    /**
     * 设置或者获取当前音频在播放列表里面的序号[从0开始]
     * @param  {Number} index 传入>=0的整数，可选填，不传入则返回当前音频在播放列表里面的序号
     * @return {Number} 返回当前音频在播放列表里面的序号,或者返回实例以便于链式调用
     */
    XAudio.prototype.index = function (index) {

        var __index = parseInt(index);

        if (index !== undefined) {

            if (!isNaN(__index) && __index >= 0 && __index < this.__list.length) {
                this.__index = __index;
                for (var i = 0; i < this.__list.length; i++) {
                    this.__list[i].isCurrent = false;
                }
                this.__list[__index].isCurrent = true;
                this.trigger('indexchange', __index)[0].src = this.__list[__index].src;
            }
            return this;

        } else {
            return this.__index;
        }

    }

    /**
     * 增加音频，传入数组批量增加
     * @param {Array/Object} item 传入一个包含src属性的对象，或者多个这样的对象组成的数组
     * @return {Object} 返回实例以便于链式调用
     */
    XAudio.prototype.add = function (item) {

        if (Object.prototype.toString.call(item) === '[object Array]') {
            item.forEach(function (subitem) {
                this.add(subitem);
            }.bind(this));
        } else if (this.__checkItem(item)) {
            item.isCurrent = false;
            this.__list.push(item);
            this.trigger('listchange', this.__list);
        }

        return this;

    }

    /**
     * 从播放列表中移除一个项目
     * @param  {Number} index 指定需要移除的项目的序号[从0开始]
     * @return {Object} 返回实例以便于链式调用
     */
    XAudio.prototype.remove = function (index) {

        var __index = parseInt(index);
        __index >= 0 && __index < this.__list.length && (this.__list.splice(__index, 1), this.trigger('listchange', this.__list));
        return this;

    }

    XAudio.prototype.on = function (eventName, method) {

        var __event;

        if (typeof eventName === "object") {

            for (__event in eventName) {
                if (Object.prototype.hasOwnProperty.call(eventName, __event) && (typeof eventName[__event] === "function")) {
                    this.on(__event, eventName[__event]);
                }
            }

        } else if (typeof eventName === "string" && typeof method === "function") {

            this.__events[eventName] || (this.__events[eventName] = []);
            this.__events[eventName].push(method);

        }

        return this;

    }

    XAudio.prototype.off = function (eventName) {

        if (typeof eventName === 'string') {
            this.__events[eventName] = [];
        }

        return this;

    }

    XAudio.prototype.trigger = function () {

        var __eventName = Array.prototype.shift.call(arguments),
            __arguments = arguments,
            __returnFalse = false,
            __that = this,
            __return;

        if (typeof __eventName === 'string' && Object.prototype.hasOwnProperty.call(this.__events, __eventName) && (this.__events[__eventName] instanceof Array)) {

            this.__events[__eventName].forEach(function (method) {

                if (!__returnFalse) {
                    __return = method.apply(__that, __arguments);
                    __return === false && (__returnFalse = true);
                }

            });

        }

        return this;

    }

    return XAudio;

});
