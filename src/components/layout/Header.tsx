import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import Link from 'next/link'

export function Header() {
    return (
        <AppBar position="static" elevation={0}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, fontWeight: 600 }}
                >
                    Bone Health Predictor
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={Link} href="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} href="/predict">
                        Predict
                    </Button>
                    <Button color="inherit" component={Link} href="/configure">
                        Configure
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
