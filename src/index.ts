
import express from "express"
import fetch from "node-fetch"
import path from "path"
import cors from "cors"
import { proxy_tla_asset } from "./proxy.js"
import { get_custom_sprite_path } from "./custom_sprite.js"
import { cache_init } from "./cache.js"

const port = 8080

cache_init()

const app = express()
app.use(cors())

app.get('/*', (req, res) => {
    if (!req.path.startsWith('/')) {
        res.send(400);
        return;
    }

    const normalized_path = path.join('/', req.path)

    // Check if this is a custom sprite or TLA asset
    if (normalized_path.includes('c!')) {
        // Load the custom sprite
        console.log(get_custom_sprite_path(normalized_path))
        res.sendFile(path.join(path.resolve(), get_custom_sprite_path(normalized_path)))
    } else {
        // Load the basegame TLA asset

        proxy_tla_asset(normalized_path).then(result => {
            for (const header_key in result.headers) {
                res.setHeader(header_key, result.headers[header_key])
            }

            res.send(result.buffer)
        }).catch((error) => {
            console.log(`Failed to proxy TLA asset ${normalized_path}: ${error}`)
        })
    }
})

app.listen(port, () => console.log(`Listening on ${port}`))