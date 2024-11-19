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

        // Read existing patients
        let patients: Patient[] = []
        try {
            const data = await fs.readFile(DB_PATH, 'utf8')
            patients = JSON.parse(data)
        } catch (error: unknown) {
            console.log('Error reading patients:', error)
            patients = []
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
