# Tough Love Arena Custom Sprite Server
Load custom sprites into your [TLA](https://toughlovearena.com) mods in the browser

## Setup
Clone or download the repository, then 
```
npm install typescript --save-dev
npm i
```

Run the server using `npm start`

## Using Custom Sprites

Put your sprites in folders like this

```
custom_assets / (if this doesn't exist, run the server once)
             charname /
                     flavorname /
                               sprite_0001.png
                               sprite_0002.png
                               ...
```

Where `charname` and `flavorname` are `image_prefix` and a flavor's `folder` in your TLA mod file. (Note that you need to add an underscore to `image_prefix`, so if your charname was `beef` your `image_prefix` would be `beef_`)

Reference sprites like this:
```
{
    sprite: "c!sprite_0001",
    duration: 5
}
```

## Loading them in the game

Open `https://toughlovearena.com/?assets=<SERVER>` where `<SERVER>` is the server address

If running this locally, <SERVER> is by default `http://localhost:8080`

You don't need to restart the server or reload TLA if you add or delete sprites. You do need to reload TLA if:
- TLA attempted to load a sprite that didn't exist, and then you put a sprite in that path
- You modify any sprite