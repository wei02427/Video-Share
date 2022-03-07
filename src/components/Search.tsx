import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";


import _ from 'lodash';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import Loading from './Loading';

import ImgWithSkeleton from './ImgWithSkeleton';

import Search from '../api/search';
import Channel from '../api/channel';


export default function Library() {
    const navigate = useNavigate();




    const params = useParams();
    const keyword = params.keyword!;
    const [imgLoaded, setImgLoaded] = useState<boolean[]>([]);

    const [videos, setVideos] = useState<{ data: { id: string, title: string, description: string }[] | undefined, results: number | undefined }>({ data: undefined, results: undefined });

    useEffect(() => {
        (async () => {
            const { data } = await Search.searchVideos(keyword);
            setVideos({ data: data.values, results: data.results });
            setImgLoaded(Array(data.values.length).fill(false));

        })();


    }, [keyword])

    return (
        <Loading
            display={!_.isUndefined(videos.data) && !_.isUndefined(videos.results)}
            element={
                <>
                    {
                        videos.results === 0
                            ? <Box display='flex' height='70vh'>
                                <Box sx={{ margin: 'auto' }}>
                                    <SearchOffIcon sx={{ fontSize: 60 }} />
                                    <Typography variant='h5'>
                                        找不到結果
                                    </Typography>
                                </Box>

                            </Box>
                            :
                            <Grid container spacing={2}>
                                {
                                    _.map(videos.data, (info, index) => {
                                        return (
                                            <Grid item key={index}>
                                                <Card sx={{ width: 300 }}>

                                                    <CardActionArea onClick={() => navigate(`/watch/${info.id}`)}>

                                                        <ImgWithSkeleton height={300 / 1.3} src={Channel.GetVideoCover(info.id)} imgLoaded={imgLoaded} setImgLoaded={setImgLoaded} index={index} />

                                                        <CardContent sx={{ height: 50 }}>

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
                </>
            }
        />


    )
}