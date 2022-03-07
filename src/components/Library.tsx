import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import moment from 'moment';


import _ from 'lodash';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';

import ImgWithSkeleton from './ImgWithSkeleton';
import DeleteIcon from '@mui/icons-material/Delete';
import Channel from '../api/channel';



export default function Library() {
    const navigate = useNavigate();
    const [imgLoaded, setImgLoaded] = useState<boolean[]>([]);

    const [videos, setVideos] = useState<{ description: string, title: string, hash: string, upload_date: string }[]>([]);

    const removeVideo = async (index: number, vid: string) => {
        const result = await Channel.DeleteVideo(vid);

        if (result.status === 200)
            setVideos(prve => {
                prve.splice(index, 1);
                return [...prve];
            })

    }
    useEffect(() => {
        (async () => {
            const { data } = await Channel.GetChannelLibrary();
            setVideos(data.videos);
            setImgLoaded(Array(data.videos.length).fill(false));

        })();


    }, [])

    return (

        _.isEmpty(videos)
            ? <Box display='flex' height='70vh'>
                <Box sx={{ margin: 'auto' }}>
                    <Typography variant='h5'>
                        尚未上傳影片
                    </Typography>
                </Box>
            </Box>
            : <Grid container spacing={2}>
                {
                    _.map(videos, (info, index) => {
                        return (
                            <Grid item key={index}>
                                <Card sx={{ width: 300 }}>
                                    <CardHeader
                                        action={
                                            <IconButton onClick={() => removeVideo(index, info.hash)} >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                        sx={{ height: 50 }}
                                        title={<Typography gutterBottom variant='subtitle1' component="div" align='left'>
                                            {info.title}
                                        </Typography>}
                                    />
                                    <CardActionArea onClick={() => navigate(`/watch/${info.hash}`)}>

                                        <ImgWithSkeleton height={300 / 1.3} src={Channel.GetVideoCover(info.hash)} imgLoaded={imgLoaded} setImgLoaded={setImgLoaded} index={index} />

                                        <CardContent sx={{ height: 50 }}>

                                            <Typography variant="body1" color="text.secondary" align='left' noWrap>
                                                {info.description}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" align='left' noWrap>
                                                {moment(info.upload_date).format('YYYY 年 MM 月 DD 日')}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    })
                }

            </Grid>

    )
}