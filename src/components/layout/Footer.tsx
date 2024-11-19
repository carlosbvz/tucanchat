import { Box, Container, Typography, Link as MuiLink } from '@mui/material'

export function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.grey[100],
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Bone Health Predictor
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <MuiLink
                            href="#"
                            variant="body2"
                            color="text.secondary"
                            underline="hover"
                        >
                            Privacy Policy
                        </MuiLink>
                        <MuiLink
                            href="#"
                            variant="body2"
                            color="text.secondary"
                            underline="hover"
                        >
                            Terms of Service
                        </MuiLink>
                        <MuiLink
                            href="#"
                            variant="body2"
                            color="text.secondary"
                            underline="hover"
                        >
                            Contact
                        </MuiLink>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}
