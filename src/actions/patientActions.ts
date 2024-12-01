'use server'

import path from 'path'
import fs from 'fs/promises'
import { copyPatientDataToServer, runPrediction } from './kabreActions'

// Load the patient data from the file located in data/patients/patient.csv
export async function loadPatientData() {
    const data = await fs.readFile(
        path.join(process.cwd(), 'data/patients/patient.csv'),
        'utf8'
    )
    return data
}

export async function savePatientData(patientData: string) {
    await fs.writeFile(
        path.join(process.cwd(), 'data/patients/patient.csv'),
        patientData
    )
}

export async function predict(patientData: string) {
    // save patients data on local db
    await savePatientData(patientData)

    // copy patient data to server
    await copyPatientDataToServer()

    // run prediction
    await runPrediction()
}
