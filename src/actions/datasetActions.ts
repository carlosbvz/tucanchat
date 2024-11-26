'use server'

import { Dataset } from '@/types/dataset'
import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'datasets.json')
const FILES_PATH = path.join(process.cwd(), 'data', 'files')

export async function addDataset(formData: FormData) {
    try {
        // Ensure the data directories exist
        await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
        await fs.mkdir(FILES_PATH, { recursive: true })

        // Read existing datasets or create new file if it doesn't exist
        let datasets: Dataset[] = []
        try {
            const data = await fs.readFile(DB_PATH, 'utf8')
            datasets = JSON.parse(data)
        } catch (error: unknown) {
            console.log('Error reading datasets:', error)
            // If file doesn't exist, create it with an empty array
            await fs.writeFile(DB_PATH, JSON.stringify([], null, 2))
            console.log('Created new datasets.json file')
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

        // Create new dataset object
        const newDataset: Dataset = {
            id,
            name: formData.get('name') as string,
            filePath: filePath || undefined,
        }

        // Add new dataset to array
        datasets.push(newDataset)

        // Write back to file
        await fs.writeFile(DB_PATH, JSON.stringify(datasets, null, 2))

        return { success: true, dataset: newDataset }
    } catch (error) {
        console.error('Error adding dataset:', error)
        return { success: false, error: 'Failed to add dataset' }
    }
}

export async function getDatasets() {
    try {
        // Ensure the data directory exists
        await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })

        try {
            const data = await fs.readFile(DB_PATH, 'utf8')
            return JSON.parse(data)
        } catch (error: unknown) {
            console.log('Error reading datasets:', error)
            return []
        }
    } catch (error) {
        console.error('Error getting datasets:', error)
        return []
    }
}

export async function getFiles() {
    const data = await fs.readdir(FILES_PATH)
    return data
}

export async function deleteDataset(id: string) {
    try {
        // Get dataset info first to get the file path
        const datasets = await getDatasets()
        const dataset = datasets.find((p: Dataset) => p.id === id)

        // If dataset has a file, delete it
        if (dataset?.filePath) {
            const filePath = path.join(process.cwd(), 'data', dataset.filePath)
            try {
                await fs.unlink(filePath)
                console.log('Deleted dataset file:', filePath)
            } catch (error) {
                console.error('Error deleting dataset file:', error)
            }
        }

        // Remove dataset from database
        const filteredDatasets = datasets.filter(
            (dataset: Dataset) => dataset.id !== id
        )

        await fs.writeFile(DB_PATH, JSON.stringify(filteredDatasets, null, 2))
        return { success: true }
    } catch (error) {
        console.error('Error deleting dataset:', error)
        return { success: false, error: 'Failed to delete dataset' }
    }
}

export async function getDatasetFileById(id: string) {
    try {
        // Get dataset info first to get the file path
        const datasets = await getDatasets()
        const dataset = datasets.find((p: Dataset) => p.id === id)

        if (!dataset?.filePath) {
            return null
        }

        // Read the CSV file
        const filePath = path.join(process.cwd(), 'data', dataset.filePath)
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
        console.error('Error reading dataset file:', error)
        return null
    }
}
