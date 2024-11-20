// worker.js
import { parentPort } from 'worker_threads'

if (parentPort) {
    parentPort.on('message', (data) => {
        const mean = calculateMean(data)
        const std = calculateStd(data, mean)
        const standardizedData = data.map((value) => (value - mean) / std)
        parentPort?.postMessage(standardizedData)
    })
}

function calculateMean(data) {
    const sum = data.reduce((acc, val) => acc + val, 0)
    return sum / data.length
}

function calculateStd(data, mean) {
    const sum = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0)
    return Math.sqrt(sum / data.length)
}
