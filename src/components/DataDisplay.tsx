'use client'

import {
    Button,
    Box,
    Paper,
    Typography,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete'
import Grid from '@mui/material/Grid2'
import { AddPatient } from '@/components/AddPatient'
import { Patient } from '@/types/patient'
import { useState } from 'react'
import {
    getPatientFileById,
    deletePatient,
    normalizePatientData,
} from '@/actions/patientActions'
import CsvGrid from '@/components/CsvGrid'
import styles from './DataDisplay.module.css'

type Props = {
    patients: Patient[]
}

type CSVData = Record<string, string | undefined>[]

export default function DataDisplay({ patients }: Readonly<Props>) {
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
    const [csvData, setCsvData] = useState<CSVData | null>(null)
    const [normalizedData, setNormalizedData] = useState<CSVData | null>(null)

    const [localPatients, setLocalPatients] = useState<Patient[]>(patients)

    const handlePatientClick = async (patientId: string) => {
        setSelectedPatient(patientId)
        const data = await getPatientFileById(patientId)
        console.log('data', data)
        setCsvData(data)
    }

    const handleNormalizeData = async () => {
        if (!selectedPatient) {
            return
        }
        const result = await normalizePatientData(selectedPatient)
        if (result.success) {
            setNormalizedData(csvData)
        }
    }

    const handleAddPatient = (patient: Patient) => {
        setLocalPatients([...localPatients, patient])
    }

    const handleDeletePatient = async (patientId: string) => {
        const result = await deletePatient(patientId)
        if (result.success) {
            setLocalPatients(localPatients.filter((p) => p.id !== patientId))
        }
        setSelectedPatient(null)
        setCsvData(null)
        setNormalizedData(null)
        setLocalPatients(localPatients.filter((p) => p.id !== patientId))
    }

    const renderContent = () => {
        if (localPatients.length === 0) {
            return <Typography>No patients found. </Typography>
        }

        if (!selectedPatient) {
            return <Typography>Select a patient to view their data</Typography>
        }

        // if (!csvData) {
        //     return <Typography>Loading data...</Typography>
        // }

        return (
            <>
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                    }}
                >
                    {csvData && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNormalizeData}
                        >
                            Normalize Data
                        </Button>
                    )}
                    {/* Add a delete patient button */}
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeletePatient(selectedPatient)}
                    >
                        Delete Patient
                    </Button>
                </Box>

                {csvData ? (
                    <>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Raw Data</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <CsvGrid csvData={csvData} />
                            </AccordionDetails>
                        </Accordion>

                        {normalizedData && (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>Normalized Data</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <CsvGrid csvData={csvData} />
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </>
                ) : (
                    <Typography>Loading data...</Typography>
                )}
            </>
        )
    }

    return (
        <Box>
            <Grid container sx={{ minHeight: 'calc(100vh - 150px)' }}>
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
                        <AddPatient onSuccess={handleAddPatient} />
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
                            {localPatients.map((patient) => (
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
                    sx={{
                        height: '100%',
                        p: 4,
                    }}
                >
                    {renderContent()}
                </Grid>
            </Grid>
        </Box>
    )
}
