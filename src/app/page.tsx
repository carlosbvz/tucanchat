import { getDatasets } from '@/actions/datasetActions'
import DataDisplay from '@/components/DataDisplay'

export default async function Home() {
    const datasets = await getDatasets()

    return (
        <div>
            <DataDisplay datasets={datasets} />
        </div>
    )
}
