
import path from 'path'

export const get_custom_sprite_path = (asset_path: string): string => {
    const char_flavor = asset_path.split('/original/')[1].split('_c!')[0].split('/')

    const char = path.join('/', char_flavor[1])
    const flavor = path.join('/', char_flavor[0])
    const sprite = path.join('/', asset_path.split('c!')[1])
    
    return path.join('/', '/custom_assets', char, flavor, sprite)
}