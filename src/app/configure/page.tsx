import { Container } from '@mui/material'
import { getConfig } from '@/actions/configActions'
import ConfigForm from './_components/ConfigForm'

export default async function page() {
    const config = await getConfig()

    console.log(config)

    return (
        <Container sx={{ marginTop: 4 }}>
            <ConfigForm config={config} />
        </Container>
    )
}
