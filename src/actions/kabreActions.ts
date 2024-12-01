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

export async function runPrediction() {
    try {
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
        const sbatchCommand = 'sbatch predict.slurm'
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
    } // run prediction
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

export async function copySlurmFilesToServer() {
    try {
        // Get slurm files path and upload to server
        const normalizeSlurmPath = path.join(
            process.cwd(),
            'data',
            'slurm',
            'normalize.slurm'
        )
        const predictSlurmPath = path.join(
            process.cwd(),
            'data',
            'slurm',
            'predict.slurm'
        )

        await uploadFileToServer(
            normalizeSlurmPath,
            'projecto/data/normalize.slurm'
        )
        await uploadFileToServer(
            predictSlurmPath,
            'projecto/data/predict.slurm'
        )

        return {
            success: true,
            message: 'Slurm files successfully uploaded',
        }
    } catch (error) {
        console.error('Error copying slurm files to server:', error)
    }
}

export async function copyPatientDataToServer() {
    try {
        const patientDataPath = path.join(
            process.cwd(),
            'data',
            'patients',
            'patient.csv'
        )
        await uploadFileToServer(patientDataPath, 'projecto/data/patient.csv')

        return {
            success: true,
            message: 'Patient data successfully uploaded',
        }
    } catch (error) {
        console.error('Error copying patient data to server:', error)
    }
}
