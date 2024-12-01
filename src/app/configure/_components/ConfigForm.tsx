'use client'

import React, { useState } from 'react'
import { Container, Typography, Button } from '@mui/material'
import { Config, updateConfig } from '@/actions/configActions'

export default function ConfigForm({ config }: { config: Config }) {
    const [normalize, setNormalize] = useState(config.normalize)
    const [predict, setPredict] = useState(config.predict)

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault()
        await updateConfig({
            normalize,
            predict,
        })
    }

    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography>Normalize</Typography>
            <textarea
                style={{ width: '100%', height: '300px' }}
                value={normalize}
                onChange={(e) => setNormalize(e.target.value)}
            />

            <Typography mt={4}>Predict</Typography>
            <textarea
                style={{ width: '100%', height: '300px' }}
                value={predict}
                onChange={(e) => setPredict(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </Container>
    )
}
