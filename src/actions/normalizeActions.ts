'use server'

import fs from 'fs/promises'
import path from 'path'
import * as math from 'mathjs'
import { getDatasetFileById } from '@/actions/datasetActions'

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

async function readCSV(datasetId: string): Promise<Data[]> {
    const filePath = await getDatasetFileById(datasetId)

    if (!filePath || typeof filePath !== 'string') {
        throw new Error('Invalid file path returned for dataset ID')
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
    datasetId: string,
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
        `${datasetId}.csv`
    )
    await fs.writeFile(filePath, header + dataLines)
}

export async function normalizeDataset(
    datasetId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        console.log('normalize')
        /** 
         * dataArray is an array of objects, each object represents a row in the CSV file
         * example of a record:
         *  {
                id: '100',
                Gender: '0',
                Age: '58',
                Height: '169.77299645650027',
                Weight: '56.35767869392631',
                Chair_stand: '21',
                Arm_curl: '15',
                Six_min_walk: '526.5523468004247',
                Steps: '111',
                Trunk_flex: '14.542080751986948',
                Back_scratch: '8.266610493887946',
                TUG: '10.868178317128937',
                Handgrip1: '31.297422561440452',
                VO2_ml: '1892.090048250685',
                VO2peak: '21.110298585356816',
                DXA: '32.203921888940314',
                BMD: '1.2543524473743402',
                Ost: '1'
            }
        */
        const dataArray = await await getDatasetFileById(datasetId)

        console.log('dataArray', dataArray?.length)

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

        // console.log('dataArray', fields)
        fields.forEach((field) => {
            const values = dataArray?.map((data) => data[field])
            console.log('values', values)
            // const standardizedValues = standardizeArray(values)
            // standardizedValues.forEach((value, index) => {
            //     dataArray[index][field] = value
            // })
        })

        // await writeNormalizedData(datasetId, dataArray)
        return { success: true }
    } catch (error) {
        console.error('Error normalizing dataset:', error)
        return { success: false, error: 'Failed to normalize dataset' }
    }
}
