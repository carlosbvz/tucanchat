import React from 'react'
import { Box, Typography } from '@mui/material'

type Props = {
    csvData: Record<string, string | undefined>[]
}

export default function CsvGrid({ csvData }: Readonly<Props>) {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Patient Data
            </Typography>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                }}
            >
                <thead>
                    <tr>
                        {csvData.length > 0 &&
                            Object.keys(csvData[0]).map((header) => (
                                <th
                                    key={header}
                                    style={{
                                        padding: '8px',
                                        borderBottom: '1px solid #ddd',
                                        textAlign: 'left',
                                    }}
                                >
                                    {header}
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {csvData.map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((value, i) => (
                                <td
                                    key={i}
                                    style={{
                                        padding: '8px',
                                        borderBottom: '1px solid #ddd',
                                    }}
                                >
                                    {value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    )
}
