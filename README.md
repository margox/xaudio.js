## Web Audio扩展模块
##### 一个基于HTMLAudioElement的播放模块

-----

### 特性
- 支持播放列表
- 支持三种播放模式：单曲循环，列表循环，随机播放
- 支持上一曲下一曲操作
- 诸多便捷细节，如：直接返回/设置播放百分比，获取已播放/总时长的分钟值，等等
- 纯属娱乐，仅供参考

### 示例

```javascript
var list = [
    {
        'src' : '//xxx/song1.mp3',
    },
    {
        'src' : '//xxx/song2.mp3',
    },
    {
        'src' : '//xxx/song3.mp3',
    },
    {
        'src' : '//xxx/song4.mp3',
    },
    {
        'src' : '//xxx/song5.mp3',
    }
];

var player = new XAudio(list);

// 获取播放列表长度
player.listLength(); // 5

// 播放列表里面的第4首
player.index(3).play();
// 或者
player.play(4);

// 获取当前播放的index
player.index(); // 4

// 更改播放模式[1：列表，2：单曲，3：随机]
player.mode(3);

// 跳转到30%播放
player.progress(30);

// 暂停播放

```
---

##### 更详细的内容请参见代码注释