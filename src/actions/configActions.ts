'use server'

// Create an action to retrieve a file from the config.json file
import fs from 'fs/promises'
import path from 'path'
import { copySlurmFilesToServer } from './kabreActions'

export type Config = {
    normalize: string
    predict: string
}
export async function getConfig(): Promise<Config> {
    // Get the .slurm files in the slurm directory
    const slurmDir = path.join(process.cwd(), 'data', 'slurm')
    const slurmFiles = await fs.readdir(slurmDir)
    console.log(slurmFiles)

    // Read the content of each .slurm file
    const slurmContents = await Promise.all(
        slurmFiles.map(async (file) => {
            const filePath = path.join(slurmDir, file)
            const content = await fs.readFile(filePath, 'utf-8')
            return content
        })
    )

    return {
        normalize: slurmContents[0],
        predict: slurmContents[1],
    }
}

export async function updateConfig(config: Config) {
    // Get config data and update .slurm files
    const slurmDir = path.join(process.cwd(), 'data', 'slurm')
    await fs.writeFile(path.join(slurmDir, 'normalize.slurm'), config.normalize)
    await fs.writeFile(path.join(slurmDir, 'predict.slurm'), config.predict)

    // Upload the updated .slurm files to the server
    await copySlurmFilesToServer()

    return { success: true }
}
