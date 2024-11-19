import { Button, Box } from '@mui/material'
import { AddPatient } from '@/components/AddPatient'

export default function Home() {
    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
            }}
        >
            {/* Left Panel - Menu */}
            <div
                style={{
                    width: '250px',
                    backgroundColor: '#f5f5f5',
                    padding: '20px',
                    borderRight: '1px solid #ddd',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                }}
            >
                <Box mb={2}>
                    <AddPatient />
                </Box>
                <Button>Patient 1</Button>
                <Button>Patient 2</Button>
                <Button>Patient 3</Button>
            </div>

            {/* Right Panel - Content */}
            <div
                style={{
                    flex: 1,
                    padding: '20px',
                }}
            >
                <h1>Main Content</h1>
                <p>This is your content area</p>
            </div>
        </div>
    )
}
