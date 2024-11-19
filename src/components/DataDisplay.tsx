'use client'

import { Box, Paper, Typography, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { AddPatient } from '@/components/AddPatient'
import { Patient } from '@/types/patient'
import { useState } from 'react'
import { getPatientFileById } from '@/actions/patientActions'
import CsvGrid from '@/components/CsvGrid'
import styles from './DataDisplay.module.css'

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
        if (patients.length === 0) {
            return <Typography>No patients found. </Typography>
        }

        if (!selectedPatient) {
            return <Typography>Select a patient to view their data</Typography>
        }

        if (!csvData) {
            return <Typography>Loading data...</Typography>
        }

        return <CsvGrid csvData={csvData} />
    }

    return (
        <Box sx={{ height: '100vh' }}>
            <Grid container sx={{ height: '100%' }}>
                {/* Left Panel - Patients List */}
                <Grid size={{ xs: 3 }}>
                    <Paper
                        elevation={2}
                        sx={{
                            height: '100%',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#2c3e50',
                                borderBottom: '2px solid #e9ecef',
                                pb: 1,
                            }}
                        >
                            Patients
                        </Typography>
                        <AddPatient />
                        <Stack
                            spacing={1}
                            sx={{
                                mt: 2,
                                overflow: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#cbd5e1',
                                    borderRadius: '4px',
                                },
                            }}
                        >
                            {patients.map((patient) => (
                                <button
                                    key={patient.id}
                                    className={`${styles.patientButton} ${
                                        selectedPatient === patient.id
                                            ? styles.selected
                                            : ''
                                    }`}
                                    onClick={() =>
                                        handlePatientClick(patient.id)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handlePatientClick(patient.id)
                                        }
                                    }}
                                >
                                    {patient.name}
                                </button>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                {/* Right Panel - CSV Data Display */}
                <Grid
                    size={{ xs: 9 }}
                    sx={{ height: '100%', p: 4, backgroundColor: '#ffffff' }}
                >
                    {renderContent()}
                </Grid>
            </Grid>
        </Box>
    )
}
