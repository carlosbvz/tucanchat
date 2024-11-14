'use client'

import {
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    Alert,
    Chip,
    Divider,
    Stack,
} from '@mui/material'

export default function LibraryPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Typography variant="h2" gutterBottom>
                Component Library
            </Typography>

            <Stack spacing={4}>
                {/* Typography Section */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Typography
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h1">h1. Heading</Typography>
                        <Typography variant="h2">h2. Heading</Typography>
                        <Typography variant="h3">h3. Heading</Typography>
                        <Typography variant="body1">
                            body1. Lorem ipsum dolor sit amet, consectetur
                            adipisicing elit. Quos blanditiis tenetur unde
                            suscipit.
                        </Typography>
                        <Typography variant="body2">
                            body2. Lorem ipsum dolor sit amet, consectetur
                            adipisicing elit. Quos blanditiis tenetur unde
                            suscipit.
                        </Typography>
                    </CardContent>
                </Card>

                {/* Buttons Section */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Buttons
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <Button variant="contained">Contained</Button>
                            <Button variant="outlined">Outlined</Button>
                            <Button variant="text">Text</Button>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary">
                                Primary
                            </Button>
                            <Button variant="contained" color="secondary">
                                Secondary
                            </Button>
                            <Button variant="contained" color="error">
                                Error
                            </Button>
                            <Button variant="contained" disabled>
                                Disabled
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Form Elements */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Form Elements
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={2}>
                            <TextField label="Standard" variant="standard" />
                            <TextField label="Outlined" variant="outlined" />
                            <TextField label="Filled" variant="filled" />
                            <TextField
                                error
                                label="Error"
                                defaultValue="Invalid input"
                                helperText="Incorrect entry."
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* Alerts */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Alerts
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={2}>
                            <Alert severity="error">
                                This is an error alert!
                            </Alert>
                            <Alert severity="warning">
                                This is a warning alert!
                            </Alert>
                            <Alert severity="info">
                                This is an info alert!
                            </Alert>
                            <Alert severity="success">
                                This is a success alert!
                            </Alert>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Chips */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Chips
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" spacing={1}>
                            <Chip label="Primary" color="primary" />
                            <Chip label="Secondary" color="secondary" />
                            <Chip label="Success" color="success" />
                            <Chip label="Error" color="error" />
                            <Chip label="Warning" color="warning" />
                            <Chip label="Info" color="info" />
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </div>
    )
}
