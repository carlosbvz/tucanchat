// Create an action to retrieve a file from the config.json file
import fs from 'fs/promises'
import path from 'path'

const CONFIG_FILE_PATH = path.join(process.cwd(), 'data', 'config.json')
export type Config = {
    normalize: string
    predict: string
}
export async function getConfig(): Promise<Config> {
    const config = await fs.readFile(CONFIG_FILE_PATH, 'utf8')
    return JSON.parse(config)
}

export async function updateConfig(config: Config) {
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2))
}
