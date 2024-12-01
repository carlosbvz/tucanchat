'use server'

import { executeRemoteCommand, uploadFileToServer } from './sshActions'
import { getDatasets } from './datasetActions'
import path from 'path'
import { Dataset } from '@/types/dataset'
import fs from 'fs'

export async function runNormalization(datasetId: string) {
    try {
        console.log('Running normalization for dataset ID:', datasetId)
        // First, change directory
        const cdCommand = 'cd projecto/data'
        const cdResult = await executeRemoteCommand(cdCommand)

        if (!cdResult.success) {
            return {
                success: false,
                error: `Failed to change directory: ${cdResult.error}`,
            }
        }

        // Then, run the sbatch command
        const sbatchCommand = 'sbatch normalize.slurm'
        const sbatchResult = await executeRemoteCommand(
            `${cdCommand} && ${sbatchCommand}`
        )

        if (!sbatchResult.success) {
            return {
                success: false,
                error: `Failed to submit Slurm job: ${sbatchResult.error}`,
            }
        }

        return {
            success: true,
            output: sbatchResult.output,
        }
    } catch (error) {
        console.error('Error running Slurm commands:', error)
        return {
            success: false,
            error: 'Failed to execute Slurm commands',
        }
    }
}

export async function copyDatasetCSVToServer(datasetId: string) {
    try {
        console.log('Copying dataset CSV to server for ID:', datasetId)

        // Get the dataset data to retrieve the file path
        const datasets = await getDatasets()
        const dataset = datasets.find((p: Dataset) => p.id === datasetId)

        if (!dataset?.filePath) {
            return {
                success: false,
                error: `CSV file for dataset ID ${datasetId} not found`,
            }
        }

        const localFilePath = path.join(process.cwd(), 'data', dataset.filePath)

        // Check if the file exists locally
        if (!fs.existsSync(localFilePath)) {
            return {
                success: false,
                error: `Local file not found: ${localFilePath}`,
            }
        }

        console.log('localFilePath', localFilePath)

        // // Define the remote directory path
        const remoteDirectory = `projecto/data/data.csv`

        console.log('Local file path:', localFilePath)
        console.log('Uploading file to server')

        // // Upload the file to the remote server
        const uploadResult = await uploadFileToServer(
            localFilePath,
            remoteDirectory
        )
        if (!uploadResult.success) {
            console.error('File upload error:', uploadResult.error)
            return {
                success: false,
                error: `Failed to upload CSV file: ${uploadResult.error}`,
            }
        }

        return {
            success: true,
            message: `CSV file for dataset ID ${datasetId} successfully uploaded`,
        }
    } catch (error) {
        console.error('Error copying CSV file to server:', error)
        return {
            success: false,
            error: 'Failed to copy CSV file to server',
        }
    }
}
