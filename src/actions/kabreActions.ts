'use server'

import { executeRemoteCommand, uploadFileToServer } from './sshActions'
import { getPatients } from './patientActions'
import path from 'path'
import { Patient } from '@/types/patient'
import fs from 'fs'

export async function runNormalization(patientId: string) {
    try {
        console.log('Running normalization for patient ID:', patientId)
        // First, change directory
        const cdCommand =
            'cd class-examples/PP_UCR/OpenMP/example2_parallel_for'
        const cdResult = await executeRemoteCommand(cdCommand)

        if (!cdResult.success) {
            return {
                success: false,
                error: `Failed to change directory: ${cdResult.error}`,
            }
        }

        // Then, run the sbatch command
        const sbatchCommand = 'sbatch submit.slurm'
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

export async function copyPatientCSVToServer(patientId: string) {
    try {
        console.log('Copying patient CSV to server for ID:', patientId)

        // Get the patient data to retrieve the file path
        const patients = await getPatients()
        const patient = patients.find((p: Patient) => p.id === patientId)

        if (!patient || !patient.filePath) {
            return {
                success: false,
                error: `CSV file for patient ID ${patientId} not found`,
            }
        }

        const localFilePath = path.join(process.cwd(), 'data', patient.filePath)

        // Check if the file exists locally
        if (!fs.existsSync(localFilePath)) {
            return {
                success: false,
                error: `Local file not found: ${localFilePath}`,
            }
        }

        // Define the remote directory path
        const remoteDirectory = 'projecto/raw'

        console.log('Local file path:', localFilePath)
        console.log('Uploading file to server')

        // Upload the file to the remote server
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
            message: `CSV file for patient ID ${patientId} successfully uploaded`,
        }
    } catch (error) {
        console.error('Error copying CSV file to server:', error)
        return {
            success: false,
            error: 'Failed to copy CSV file to server',
        }
    }
}
