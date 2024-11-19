'use client'

import { Button, Box, Paper, Typography, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { AddPatient } from '@/components/AddPatient'
import { Patient } from '@/types/patient'
import { useState } from 'react'
import { getPatientFileById } from '@/actions/patientActions'
import CsvGrid from '@/components/CsvGrid'

type Props = {
    patients: Patient[]
}

type CSVData = Record<string, string | undefined>[]

export default function DataDisplay({ patients }: Readonly<Props>) {
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
    const [csvData, setCsvData] = useState<CSVData | null>(null)

    const handlePatientClick = async (patientId: string) => {
        setSelectedPatient(patientId)
        const data = await getPatientFileById(patientId)
        setCsvData(data)
    }

    const renderContent = () => {
        if (!selectedPatient) {
            return <Typography>Select a patient to view their data</Typography>
        }

        if (!csvData) {
            return <Typography>Loading data...</Typography>
        }

        return <CsvGrid csvData={csvData} />
    }

    return (
        <Box sx={{}}>
            <Grid container>
                {/* Left Panel - Patients List */}
                <Grid size={{ xs: 3 }} sx={{ height: '100vh' }}>
                    <Paper
                        elevation={2}
                        sx={{
                            height: '100%',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Patients
                        </Typography>
                        <AddPatient />
                        <Stack spacing={1} sx={{ mt: 2, overflow: 'auto' }}>
                            {patients.map((patient) => (
                                <Button
                                    key={patient.id}
                                    variant={
                                        selectedPatient === patient.id
                                            ? 'outlined'
                                            : 'text'
                                    }
                                    onClick={() =>
                                        handlePatientClick(patient.id)
                                    }
                                    fullWidth
                                >
                                    {patient.name}
                                </Button>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                {/* Right Panel - CSV Data Display */}
                <Grid size={{ xs: 9 }} sx={{ height: '100vh', p: 4 }}>
                    {renderContent()}
                </Grid>
            </Grid>
        </Box>
    )
}
