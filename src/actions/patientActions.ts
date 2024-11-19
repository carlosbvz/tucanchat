'use server'

import { Patient } from '@/types/patient'
import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'patients.json')
const FILES_PATH = path.join(process.cwd(), 'data', 'files')

export async function addPatient(formData: FormData) {
    try {
        // Ensure the data directories exist
        await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
        await fs.mkdir(FILES_PATH, { recursive: true })

        // Read existing patients or create new file if it doesn't exist
        let patients: Patient[] = []
        try {
            const data = await fs.readFile(DB_PATH, 'utf8')
            patients = JSON.parse(data)
        } catch (error: unknown) {
            console.log('Error reading patients:', error)
            // If file doesn't exist, create it with an empty array
            await fs.writeFile(DB_PATH, JSON.stringify([], null, 2))
            console.log('Created new patients.json file')
        }

        // Generate a unique ID (timestamp-based)
        const id = Date.now().toString()

        // Handle file upload
        const file = formData.get('file') as File
        let filePath = ''

        if (file && file.size > 0) {
            const fileExtension = file.name.split('.').pop()
            const fileName = `${id}.${fileExtension}`
            filePath = path.join('files', fileName)

            // Convert File to ArrayBuffer and then to Buffer
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            // Save the file
            await fs.writeFile(path.join(FILES_PATH, fileName), buffer)
        }

        // Create new patient object
        const newPatient: Patient = {
            id,
            name: formData.get('name') as string,
            filePath: filePath || undefined,
        }

        // Add new patient to array
        patients.push(newPatient)

        // Write back to file
        await fs.writeFile(DB_PATH, JSON.stringify(patients, null, 2))

        return { success: true, patient: newPatient }
    } catch (error) {
        console.error('Error adding patient:', error)
        return { success: false, error: 'Failed to add patient' }
    }
}

export async function getPatients() {
    const data = await fs.readFile(DB_PATH, 'utf8')
    return JSON.parse(data)
}

export async function getFiles() {
    const data = await fs.readdir(FILES_PATH)
    return data
}

export async function deletePatient(id: string) {
    const patients = await getPatients()
    const filteredPatients = patients.filter(
        (patient: Patient) => patient.id !== id
    )
    await fs.writeFile(DB_PATH, JSON.stringify(filteredPatients, null, 2))
}

export async function getPatientFileById(id: string) {
    try {
        // Get patient info first to get the file path
        const patients = await getPatients()
        const patient = patients.find((p: Patient) => p.id === id)

        if (!patient?.filePath) {
            return null
        }

        // Read the CSV file
        const filePath = path.join(process.cwd(), 'data', patient.filePath)
        const fileContent = await fs.readFile(filePath, 'utf8')

        // Parse CSV content
        const rows = fileContent.split('\n')
        const headers = rows[0].split(',')
        const data = rows.slice(1).map((row) => {
            const values = row.split(',')
            return headers.reduce(
                (obj: Record<string, string | undefined>, header, index) => {
                    obj[header.trim()] = values[index]?.trim()
                    return obj
                },
                {}
            )
        })

        return data
    } catch (error) {
        console.error('Error reading patient file:', error)
        return null
    }
}
