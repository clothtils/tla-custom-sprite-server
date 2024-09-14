
import fetch from 'node-fetch'
import path from 'path'
import { cache_get, cache_set } from './cache.js';

const TLA_CLOUD_PATH = 'https://assets.toughlovearena.cloud'
const TLA_CLOUD_HEADERS = {
    "accept": "*/*",
    "Origin": "https://toughlovearena.com",
    "Host": "assets.toughlovearena.cloud",
    "Referer": "https://toughlovearena.com",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
}

const BLOCKED_HEADERS = ['access-control-allow-origin', 'access-control-expose-headers', 'content-encoding', 'cf-ray', 'expires', 'report-to']
  
export interface TLAProxyResult {
    buffer: Buffer;
    headers: Record<string, string>
}

export const proxy_tla_asset = (asset_path: string) => new Promise<TLAProxyResult>(async (resolve, reject) => {
    cache_get(asset_path).then(result => {
        // Cached

        resolve(result)
    }).catch(() => {
         // Not cached, fetch it

        fetch(path.join(TLA_CLOUD_PATH, asset_path), {
            headers: TLA_CLOUD_HEADERS,
            method: "GET"
        }).then(async result => {
            const headers: Record<string, string> = {}
            result.headers.forEach((value, key) => {
                if (!BLOCKED_HEADERS.includes(key.toLocaleLowerCase())) headers[key] = value
            })

            const buffer = Buffer.from(await result.arrayBuffer())
            cache_set(asset_path, buffer, headers)

            resolve({
                buffer, headers
            })
        }).catch(reject)
    })
})