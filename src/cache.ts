
import { v4 } from "uuid"
import fs from "fs"
import async_fs from "fs/promises"
import { TLAProxyResult } from "./proxy.js"
import path from "path"

interface CacheEntry {
    file_id: string,
    headers: Record<string, string>
}

let asset_cache: Record<string, CacheEntry>

export const cache_init = () => {
    if (!fs.existsSync('custom_assets')) fs.mkdirSync('custom_assets')
    if (!fs.existsSync('asset_cache')) fs.mkdirSync('asset_cache')

    try {
        asset_cache = JSON.parse(fs.readFileSync('asset_cache.json', 'utf8'))
        console.log('Loaded asset cache')
    } catch {
        console.log('Made asset cache')
        asset_cache = {}
    }
}

export const cache_get = (asset_path: string) => new Promise<TLAProxyResult>((resolve, reject) => {
    if (!asset_cache[asset_path]) {
        reject();
        return;
    }

    const cached_asset = asset_cache[asset_path]

    async_fs.readFile(path.join('asset_cache', cached_asset.file_id)).then(buffer => {
        resolve({
            buffer,
            headers: cached_asset.headers
        })
    }).catch((error) => {
        console.log(`Failed to load cached file for ${asset_path}: ${error}`)
        delete asset_cache[asset_path]
        reject()
    })
})

export const cache_set = (asset_path: string, buffer: Buffer, headers: Record<string, string>) => {
    const file_id = v4()

    async_fs.writeFile(path.join('asset_cache', file_id), buffer).then(() => {
        asset_cache[asset_path] = {
            file_id,
            headers
        }

        fs.writeFileSync('asset_cache.json', JSON.stringify(asset_cache))

        console.log(`Cached TLA asset ${asset_path}`)
    }).catch((error) => console.log(`Failed to cache TLA asset ${asset_path}: ${error}`))
}