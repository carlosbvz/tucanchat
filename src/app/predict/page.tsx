'use client'
import React, { useState } from 'react'
import Grid from '@mui/material/Grid2'
import {
    Button,
    TextField,
    Box,
    Typography,
    Container,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'

const SeniorFitnessTestForm: React.FC = () => {
    const [formData, setFormData] = useState({
        chairStand: '',
        armCurl: '',
        sixMinuteWalk: '',
        trunkFlex: '',
        backScratch: '',
        TUG: '',
        handgrip: '',
        gender: '',
        age: '',
        height: '',
        weight: '',
        steps: '',
        VO2_ml: '',
        VO2peak: '',
        DXA: '',
        BMD: '',
    })

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Submitted Data:', formData)
        // Here you can handle the form submission, e.g., send data to an API
    }

    return (
        <Container maxWidth="md">
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Typography variant="h6">
                    Senior Fitness Test - Osteoporosis Calculator
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Chair Stand Test (stands)"
                            name="chairStand"
                            value={formData.chairStand}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Arm Curl Test (curls)"
                            name="armCurl"
                            value={formData.armCurl}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="6-Minute Walk Test (meters)"
                            name="sixMinuteWalk"
                            value={formData.sixMinuteWalk}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Trunk Flexibility (cm)"
                            name="trunkFlex"
                            value={formData.trunkFlex}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Back Scratch Test (cm gap)"
                            name="backScratch"
                            value={formData.backScratch}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Timed Up and Go (TUG) (seconds)"
                            name="TUG"
                            value={formData.TUG}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Handgrip Strength (kg)"
                            name="handgrip"
                            value={formData.handgrip}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <FormControl fullWidth required margin="normal">
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                                labelId="gender-label"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>Male</MenuItem>
                                <MenuItem value={0}>Female</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Height (cm)"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Weight (kg)"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Steps"
                            name="steps"
                            value={formData.steps}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="VO2 (ml)"
                            name="VO2_ml"
                            value={formData.VO2_ml}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="VO2 Peak"
                            name="VO2peak"
                            value={formData.VO2peak}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="DXA"
                            name="DXA"
                            value={formData.DXA}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="BMD"
                            name="BMD"
                            value={formData.BMD}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Box>
        </Container>
    )
}

export default SeniorFitnessTestForm
