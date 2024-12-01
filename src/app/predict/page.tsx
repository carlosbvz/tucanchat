import { Container } from '@mui/material'
import { loadPatientData } from '@/actions/patientActions'
import PredictForm from './PredictForm'

export default async function page() {
    const patientData = await loadPatientData()

    return (
        <Container sx={{ marginTop: 4 }}>
            <PredictForm patientData={patientData} />
        </Container>
    )
}
