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
import { AddDataset } from '@/components/AddDataset'
import { Dataset } from '@/types/dataset'
import { useState } from 'react'
import { getDatasetFileById, deleteDataset } from '@/actions/datasetActions'
import { normalizeDataset } from '@/actions/normalizeActions'
import { copyDatasetCSVToServer } from '@/actions/kabreActions'
import CsvGrid from '@/components/CsvGrid'
import styles from './DataDisplay.module.css'

type Props = {
    datasets: Dataset[]
}

type CSVData = Record<string, string | undefined>[]

export default function DataDisplay({ datasets }: Readonly<Props>) {
    const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(
        null
    )
    const [csvData, setCsvData] = useState<CSVData | null>(null)
    const [normalizedData, setNormalizedData] = useState<CSVData | null>(null)

    const [localDatasets, setLocalDatasets] = useState<Dataset[]>(datasets)

    const handleDatasetClick = async (datasetId: string) => {
        setSelectedDatasetId(datasetId)
        const data = await getDatasetFileById(datasetId)
        setCsvData(data)
    }

    const handleNormalizeData = async () => {
        if (!selectedDatasetId) {
            return
        }
        const result = await normalizeDataset(selectedDatasetId)
        if (result.success) {
            setNormalizedData(csvData)
        }
    }

    const handleAddDataset = (dataset: Dataset) => {
        setLocalDatasets([...localDatasets, dataset])
    }

    const handleDeleteDataset = async (datasetId: string) => {
        const result = await deleteDataset(datasetId)
        if (result.success) {
            setLocalDatasets(localDatasets.filter((p) => p.id !== datasetId))
        }
        setSelectedDatasetId(null)
        setCsvData(null)
        setNormalizedData(null)
        setLocalDatasets(localDatasets.filter((p) => p.id !== datasetId))
    }

    const handleOnUpload = async () => {
        if (!selectedDatasetId) {
            return
        }
        const response = await copyDatasetCSVToServer(selectedDatasetId)
        if (response.success) {
            console.log('Uploaded to server')
        }
    }

    const renderContent = () => {
        if (localDatasets.length === 0) {
            return <Typography>No datasets found. </Typography>
        }

        if (!selectedDatasetId) {
            return <Typography>Select a dataset to view their data</Typography>
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
                        <>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleOnUpload}
                            >
                                Upload
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNormalizeData}
                            >
                                Normalize Data
                            </Button>
                        </>
                    )}
                    {/* Add a delete dataset button */}
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteDataset(selectedDatasetId)}
                    >
                        Delete Dataset
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
                {/* Left Panel - Datasets List */}
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
                            Datasets
                        </Typography>
                        <AddDataset onSuccess={handleAddDataset} />
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
                            {localDatasets.map((dataset) => (
                                <button
                                    key={dataset.id}
                                    className={`${styles.datasetButton} ${
                                        selectedDatasetId === dataset.id
                                            ? styles.selected
                                            : ''
                                    }`}
                                    onClick={() =>
                                        handleDatasetClick(dataset.id)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleDatasetClick(dataset.id)
                                        }
                                    }}
                                >
                                    {dataset.name}
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
