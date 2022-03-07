import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Loading from './Loading';

import ImgWithSkeleton from './ImgWithSkeleton';

import _ from 'lodash';
import Search from '../api/search';
import Channel from '../api/channel';

export default function Index() {
    const navigate = useNavigate();
    const [imgLoaded, setImgLoaded] = useState<boolean[]>([]);
    const [videos, setVideos] = useState<{ description: string, title: string, hash: string, upload_date: string }[]>([]);
    useEffect(() => {
        (async () => {
            const { data } = await Search.getAllVideos();
            setVideos(data);
            setImgLoaded(Array(data.length).fill(false));
        })()
    }, []);

    return (
        <Loading
            display={!_.isEmpty(videos)}
            element={
                <Grid container spacing={3}>
                    {
                        _.map(videos, (info, index) => {
                            return (
                                <Grid item key={index}>
                                    <Card sx={{ width: 345 }}>
                                        <CardActionArea onClick={() => navigate(`/watch/${info.hash}`)}>

                                            <ImgWithSkeleton height={345 / 1.3} src={Channel.GetVideoCover(info.hash)} imgLoaded={imgLoaded} setImgLoaded={setImgLoaded} index={index} />

                                            <CardContent>
                                                <Typography gutterBottom variant='subtitle1' component="div" align='left'>
                                                    {info.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" align='left' noWrap>
                                                    {info.description}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                        })
                    }

                </Grid>
            }
        />

    )

}