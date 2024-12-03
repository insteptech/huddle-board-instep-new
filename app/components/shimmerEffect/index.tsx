import React from 'react';
import { Skeleton, TableBody, TableCell, TableRow, Box } from '@mui/material';

const ShimmerTable: React.FC = () => {
    const columns = ["Appt Time", "Patient Name", "Type of Visit", "Clinician", "Screening", "Action"];
    const rowCount = 10; // Number of shimmer rows

    return (
        <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    {/* Empty TableRow for shimmer effect */}
                    <TableRow>
                        {columns.map((_, cellIndex) => (
                            <TableCell 
                                key={`empty-${cellIndex}`} 
                                style={{ height: '10px', backgroundColor: '#F3F7FC', padding: 0, border: 'none' }}
                            />
                        ))}
                    </TableRow>

                    {/* Shimmer TableRow with Skeleton */}
                    <TableRow key={`shimmer-${rowIndex}`} sx={{ backgroundColor: "white", mb: 2 }}>
                        {columns.map((_, cellIndex) => (
                            <TableCell
                                key={`shimmer-cell-${cellIndex}`}
                                style={{
                                    backgroundColor: 'white',
                                    border: 'none',
                                    textAlign: 'center' // Center align the shimmer
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    height={28}
                                    width="90%"
                                    style={{
                                        borderRadius: 1, 
                                        margin: 2,
                                        background: 'linear-gradient(90deg, #F0EBEB 0%, #E2E2E2 29.61%, #EBEBEB 62.23%, #F7F7F7 100%)',
                                        animation: 'shimmer 1.5s infinite ease-in-out'
                                    }} // Center within the cell
                                />
                            </TableCell>
                        ))}
                    </TableRow>
                </React.Fragment>
            ))}
        </TableBody>
    );
};

export default ShimmerTable;
