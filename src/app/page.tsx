import { getPatients } from '@/actions/patientActions'
import DataDisplay from '@/components/DataDisplay'

export default async function Home() {
    const patients = await getPatients()

    return (
        <div>
            <DataDisplay patients={patients} />
        </div>
    )
}
