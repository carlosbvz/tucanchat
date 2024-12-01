'use client'

import { TextField, Button } from '@mui/material'
import { predict } from '@/actions/patientActions'
import { useState } from 'react'
type Props = {
    patientData: string
}

export default function PredictForm({ patientData }: Props) {
    const [patientDataLocal, setPatientDataLocal] = useState(patientData)

    const handleOnPredict = async () => {
        const prediction = await predict(patientDataLocal)
        console.log(prediction)
    }

    return (
        <div>
            {' '}
            <TextField
                label="Patient Data"
                multiline
                rows={4}
                fullWidth
                defaultValue={patientDataLocal}
                onChange={(e) => setPatientDataLocal(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={handleOnPredict}
            >
                Predict
            </Button>
        </div>
    )
}
