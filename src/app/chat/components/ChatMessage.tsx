'use client'

import { Box, Card, Avatar, Stack, Typography } from '@mui/material'

interface ChatMessageProps {
    id: number
    text: string
    sender: 'user' | 'tucan'
    userName?: string
    timestamp: Date
    showName?: boolean
    isMe?: boolean
}

export function ChatMessage({
    text,
    sender,
    userName,
    showName,
    isMe,
}: Readonly<ChatMessageProps>) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
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
                {!isMe && (
                    <Avatar
                        sx={{
                            bgcolor:
                                sender === 'tucan'
                                    ? 'secondary.main'
                                    : 'grey.400',
                            width: 40,
                            height: 40,
                        }}
                    >
                        {sender === 'tucan'
                            ? '🦜'
                            : userName?.charAt(0).toUpperCase()}
                    </Avatar>
                )}
                <Stack spacing={0.5}>
                    {showName && (
                        <Typography
                            variant="caption"
                            sx={{
                                ml: 1,
                                color: 'text.secondary',
                                fontWeight: 500,
                            }}
                        >
                            {sender === 'tucan' ? 'Tucan' : userName}
                        </Typography>
                    )}
                    <Card
                        sx={{
                            p: 2,
                            bgcolor: isMe ? 'primary.main' : 'white',
                            color: isMe ? 'white' : 'text.primary',
                            borderRadius: 3,
                            boxShadow: 2,
                        }}
                    >
                        <Typography>{text}</Typography>
                    </Card>
                </Stack>
                {isMe && (
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            width: 40,
                            height: 40,
                        }}
                    >
                        {userName?.charAt(0).toUpperCase()}
                    </Avatar>
                )}
            </Stack>
        </Box>
    )
}
