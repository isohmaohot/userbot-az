# Azka Userbot Telegram

## Feature
- Support User and Bot
- Login in Bot
- Multiple Client

## Example Create Plugin

- For Update message text
```json
{
    "text": "hello",
    "regex": false,
    "flags": "i",
    "respond": [
        {
            "method": "sendMessage",
            "text": "Hello world"
        }
    ]
}
```


```bash
.
├── assets
├── client
│   ├── bot
│   │   ├── animations
│   │   ├── documents
│   │   ├── music
│   │   ├── passport
│   │   ├── photos
│   │   ├── profile_photos
│   │   ├── secret
│   │   ├── secret_thumbnails
│   │   ├── stickers
│   │   ├── temp
│   │   ├── thumbnails
│   │   ├── video_notes
│   │   ├── videos
│   │   ├── voice
│   │   └── wallpapers
│   └── userbot
│       ├── animations
│       ├── documents
│       ├── music
│       ├── passport
│       ├── photos
│       ├── profile_photos
│       ├── secret
│       ├── secret_thumbnails
│       ├── stickers
│       ├── temp
│       ├── thumbnails
│       ├── video_notes
│       ├── videos
│       ├── voice
│       └── wallpapers
├── db
├── docs
├── plugin
└── util

70 directories
```