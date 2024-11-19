import React from 'react'
import { Box, Typography } from '@mui/material'
import { FixedSizeList } from 'react-window'

type Props = {
    csvData: Record<string, string | undefined>[]
}

type RowProps = {
    index: number
    style: React.CSSProperties
    data: Record<string, string | undefined>[]
}

const Row = ({ index, style, data }: RowProps) => (
    <div
        style={{
            ...style,
            display: 'flex',
            borderBottom: '1px solid #ddd',
        }}
    >
        {Object.values(data[index]).map((value, colIndex) => (
            <div
                key={`${index}-${colIndex}`}
                style={{
                    padding: '8px',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {value}
            </div>
        ))}
    </div>
)

export default function CsvGrid({ csvData }: Readonly<Props>) {
    const headers = csvData.length > 0 ? Object.keys(csvData[0]) : []
    const ROW_HEIGHT = 35
    const HEADER_HEIGHT = 40
    const TABLE_HEIGHT = 600 // Adjust this value based on your needs

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Patient&apos;s Data
            </Typography>

            <div style={{ width: '100%' }}>
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        borderBottom: '2px solid #ddd',
                        backgroundColor: '#f5f5f5',
                        height: HEADER_HEIGHT,
                    }}
                >
                    {headers.map((header) => (
                        <div
                            key={header}
                            style={{
                                padding: '8px',
                                flex: 1,
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {header}
                        </div>
                    ))}
                </div>

                {/* Virtualized Rows */}
                <FixedSizeList
                    height={TABLE_HEIGHT}
                    width="100%"
                    itemCount={csvData.length}
                    itemSize={ROW_HEIGHT}
                    itemData={csvData}
                >
                    {Row}
                </FixedSizeList>
            </div>
        </Box>
    )
}
