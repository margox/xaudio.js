## xaudio.js
##### A Multiple Audio Player Module

-----

### Features
- playlist supported
- 3 kind of play mode：single loop，list loop，random
- skip prev and skip next
- and more
- just for fun, enjoy it :)

### Examples

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

// get list length
player.listLength(); // 5
// or
player.__list.length; // 5

// play the 4th audio in the playlist
player.index(3).play();
// or
player.play(3);

// get current index
player.index(); // 3

// switch play mode [1：list，2：single，3：random]
player.mode(3);

// jump to 30%
player.progress(30);

// jump to 65s
player.currentTime(65);

// get current time
player.currentTime(); // 65

// mute
player.muted(true);

// unmute
player.muted(false);

// play next
player.next();

// and more examples is on the way
```
---
