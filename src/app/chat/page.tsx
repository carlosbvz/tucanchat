'use client'

import { Box, Paper, TextField, IconButton, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { ChatMessage } from './components/ChatMessage'

interface Message {
    id: number
    text: string
    sender: 'user' | 'tucan'
    userName?: string
    timestamp: Date
    isMe?: boolean
}

// Updated mock data with multiple users
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
        userName: 'María',
        isMe: false,
        timestamp: new Date(),
    },
    {
        id: 3,
        text: '¡Yo también quiero saludar!',
        sender: 'user',
        userName: 'Carlos',
        isMe: true,
        timestamp: new Date(),
    },

    {
        id: 4,
        text: '¡Bienvenidos amigos! 🌺',
        sender: 'user',
        userName: 'Carlos',
        isMe: true,
        timestamp: new Date(),
    },
    {
        id: 5,
        text: '¿Podemos aprender sobre las aves?',
        sender: 'user',
        userName: 'María',
        isMe: false,
        timestamp: new Date(),
    },
]

export default function ChatPage() {
    // Function to determine if we should show the name
    const shouldShowName = (
        index: number,
        message: Message,
        prevMessage?: Message
    ) => {
        if (index === 0) return true
        if (!prevMessage) return true
        if (message.sender !== prevMessage.sender) return true
        if (
            message.sender === 'user' &&
            message.userName !== prevMessage.userName
        )
            return true
        if (message.isMe !== prevMessage.isMe) return true
        return false
    }

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
                {mockMessages.map((message, index) => (
                    <ChatMessage
                        key={message.id}
                        {...message}
                        showName={shouldShowName(
                            index,
                            message,
                            mockMessages[index - 1]
                        )}
                    />
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
