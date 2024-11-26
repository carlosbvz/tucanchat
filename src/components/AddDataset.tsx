'use client'

import { Button, Modal, Box, Typography, TextField, Stack } from '@mui/material'
import { useState } from 'react'
import { addDataset } from '@/actions/datasetActions'
import { Dataset } from '@/types/dataset'
type AddDatasetProps = {
    onSuccess?: (dataset: Dataset) => void
}

export function AddDataset({ onSuccess }: Readonly<AddDatasetProps>) {
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState<{
        success?: boolean
        message?: string
    }>({})

    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false)
        setStatus({})
    }

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const formData = new FormData(e.currentTarget)
            const result = await addDataset(formData)

            if (result.success) {
                setStatus({
                    success: true,
                    message: 'Dataset added successfully!',
                })
                onSuccess?.({
                    name: result?.dataset?.name ?? '',
                    id: result?.dataset?.id ?? '',
                })

                // Close modal after a short delay
                setTimeout(() => {
                    handleClose()
                }, 1500)
            } else {
                setStatus({
                    success: false,
                    message: result.error ?? 'Failed to add dataset',
                })
            }
        } catch (error: unknown) {
            console.log('Error adding dataset:', error)
            setStatus({
                success: false,
                message: 'An error occurred while adding the dataset',
            })
        }
    }

    return (
        <>
            <Button variant="contained" onClick={handleOpen}>
                Add Dataset
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Add New Dataset
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Dataset's Name"
                                name="name"
                                required
                            />
                            <TextField fullWidth type="file" name="file" />
                            {status.message && (
                                <Typography
                                    color={status.success ? 'success' : 'error'}
                                >
                                    {status.message}
                                </Typography>
                            )}
                            <Button type="submit" variant="contained" fullWidth>
                                Add Dataset
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Modal>
        </>
    )
}
