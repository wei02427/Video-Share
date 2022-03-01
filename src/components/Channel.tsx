import { useNavigate } from "react-router-dom";

import {
    Routes,
    Route,
} from "react-router-dom";


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Library from './Library';
import Upload from './Upload';


import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


export default function Channel() {

    const navigate = useNavigate();

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('library')}>
                            <ListItemIcon>
                                <VideoLibraryIcon />
                            </ListItemIcon>
                            <ListItemText primary="影片庫" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('upload')}>
                            <ListItemIcon>
                                <CloudUploadIcon />
                            </ListItemIcon>
                            <ListItemText primary="上傳新影片" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={9}>
                {
                    <Routes>
                        <Route path="library" element={<Library />} />
                        <Route path="upload" element={<Upload />} />
                    </Routes>
                }
            </Grid>
        </Grid>

    )
}