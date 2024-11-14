'use client'

import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Card,
    Avatar,
    Stack,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

interface Message {
    id: number
    text: string
    sender: 'user' | 'tucan'
    timestamp: Date
}

// Temporary mock data
const mockMessages: Message[] = [
    {
        id: 1,
        text: '¡Hola! Soy Tucan, tu amigo del bosque 🌴',
        sender: 'tucan',
        timestamp: new Date(),
    },
    {
        id: 2,
        text: '¡Hola Tucan!',
        sender: 'user',
        timestamp: new Date(),
    },
    {
        id: 3,
        text: '¡Dime que quieres!',
        sender: 'tucan',
        timestamp: new Date(),
    },
]

export default function ChatPage() {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'grey.100',
            }}
        >
            {/* Chat Header */}
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 0,
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    TucanChat 🦜
                </Typography>
            </Paper>

            {/* Messages Area */}
            <Box
                sx={{
                    flexGrow: 1,
                    p: 2,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {mockMessages.map((message) => (
                    <Box
                        key={message.id}
                        sx={{
                            display: 'flex',
                            justifyContent:
                                message.sender === 'user'
                                    ? 'flex-end'
                                    : 'flex-start',
                            mb: 2,
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="flex-end"
                            sx={{
                                maxWidth: '70%',
                            }}
                        >
                            {message.sender === 'tucan' && (
                                <Avatar
                                    sx={{
                                        bgcolor: 'secondary.main',
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    🦜
                                </Avatar>
                            )}
                            <Card
                                sx={{
                                    p: 2,
                                    bgcolor:
                                        message.sender === 'user'
                                            ? 'primary.main'
                                            : 'white',
                                    color:
                                        message.sender === 'user'
                                            ? 'white'
                                            : 'text.primary',
                                    borderRadius: 3,
                                    boxShadow: 2,
                                }}
                            >
                                <Typography>{message.text}</Typography>
                            </Card>
                            {message.sender === 'user' && (
                                <Avatar
                                    sx={{
                                        bgcolor: 'primary.main',
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    👤
                                </Avatar>
                            )}
                        </Stack>
                    </Box>
                ))}
            </Box>

            {/* Input Area */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    borderRadius: 0,
                    bgcolor: 'white',
                }}
            >
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Escribe tu mensaje aquí..."
                        variant="outlined"
                        size="medium"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                            },
                        }}
                    />
                    <IconButton
                        color="primary"
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                            width: 56,
                            height: 56,
                            borderRadius: 3,
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    )
}
