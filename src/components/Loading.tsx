import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


export default function Loading({ display, element }: { display: boolean, element: JSX.Element }) {
    return (
        display
            ? element
            : <Box display='flex' height='80vh' >
                <CircularProgress sx={{ margin: 'auto' }} />
            </Box>
    )
}