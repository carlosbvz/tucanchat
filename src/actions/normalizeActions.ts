'use server'

import fs from 'fs/promises'
import path from 'path'
import * as math from 'mathjs'
import { getPatientFileById } from '@/actions/patientActions'

type Data = {
    id: number
    gender: number
    age: number
    height: number
    weight: number
    chair_stand: number
    arm_curl: number
    six_min_walk: number
    steps: number
    trunk_flex: number
    back_scratch: number
    TUG: number
    handgrip1: number
    VO2_ml: number
    VO2peak: number
    DXA: number
    BMD: number
}

async function parseLine(line: string): Promise<Data> {
    const values = line.split(',').map(parseFloat)
    return {
        id: values[0],
        gender: values[1],
        age: values[2],
        height: values[3],
        weight: values[4],
        chair_stand: values[5],
        arm_curl: values[6],
        six_min_walk: values[7],
        steps: values[8],
        trunk_flex: values[9],
        back_scratch: values[10],
        TUG: values[11],
        handgrip1: values[12],
        VO2_ml: values[13],
        VO2peak: values[14],
        DXA: values[15],
        BMD: values[16],
    }
}

async function readCSV(patientId: string): Promise<Data[]> {
    const filePath = await getPatientFileById(patientId)
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('Invalid file path returned for patient ID')
    }
    const data = await fs.readFile(filePath, 'utf8')
    const lines = data.trim().split('\n')
    lines.shift() // Remove header line
    return Promise.all(lines.map(parseLine))
}

function calculateMean(data: number[]): number {
    return math.mean(data)
}

function calculateStd(data: number[]): number {
    return parseFloat(math.format(math.std(data, 'uncorrected')))
}

function standardizeArray(data: number[]): number[] {
    const mean = calculateMean(data)
    const std = calculateStd(data)
    return data.map((value) => (value - mean) / std)
}

async function writeNormalizedData(
    patientId: string,
    dataArray: Data[]
): Promise<void> {
    const header =
        'id,Gender,Age,Height,Weight,Chair_stand,Arm_curl,Six_min_walk,Steps,Trunk_flex,Back_scratch,TUG,Handgrip1,VO2_ml,VO2peak,DXA,BMD\n'
    const dataLines = dataArray
        .map(
            (data) =>
                `${data.id},${data.gender},${data.age},${data.height},${data.weight},${data.chair_stand},${data.arm_curl},${data.six_min_walk},${data.steps},${data.trunk_flex},${data.back_scratch},${data.TUG},${data.handgrip1},${data.VO2_ml},${data.VO2peak},${data.DXA},${data.BMD}`
        )
        .join('\n')
    const filePath = path.join(
        process.cwd(),
        'data',
        'normalize',
        `${patientId}.csv`
    )
    await fs.writeFile(filePath, header + dataLines)
}

export async function normalizePatientData(
    patientId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        console.log('normalize')
        const dataArray = await readCSV(patientId)

        const fields: (keyof Data)[] = [
            'age',
            'height',
            'weight',
            'chair_stand',
            'arm_curl',
            'six_min_walk',
            'steps',
            'trunk_flex',
            'back_scratch',
            'TUG',
            'handgrip1',
            'VO2_ml',
            'VO2peak',
            'DXA',
            'BMD',
        ]

        console.log('dataArray', fields)
        fields.forEach((field) => {
            const values = dataArray.map((data) => data[field] as number)
            const standardizedValues = standardizeArray(values)
            standardizedValues.forEach((value, index) => {
                dataArray[index][field] = value
            })
        })

        await writeNormalizedData(patientId, dataArray)
        return { success: true }
    } catch (error) {
        console.error('Error normalizing patient data:', error)
        return { success: false, error: 'Failed to normalize patient data' }
    }
}
