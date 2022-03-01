import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SocketContext } from '../App';



import _ from 'lodash';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';

import ImgWithSkeleton from './ImgWithSkeleton';

import Channel from '../api/channel';
import { baseURL } from '../constant/parameter';

import StringAvatar from '../util/stringAvater';

export default function Library() {
    const navigate = useNavigate();
    const { socket } = useContext(SocketContext);

    const [hasSubscribed, setHasSubscribed] = useState<boolean>(false);
    const location = useLocation();

    const params = useParams();
    const channel = params.channel!;
    const [imgLoaded, setImgLoaded] = useState<boolean[]>([]);

    const [videos, setVideos] = useState<{ description: string, title: string, hash: string, upload_date: string }[]>([]);
    const [info, setInfo] = useState<{ name: string, isSelf: boolean | undefined, isSubscriber: boolean | undefined }>({ name: '', isSelf: undefined, isSubscriber: undefined });

    useEffect(() => {
        (async () => {
            const { data } = await Channel.GetChannelLibrary(channel);
            setVideos(data.videos);
            setImgLoaded(Array(data.videos.length).fill(false));
            const { name, isSelf, isSubscriber } = data;
            setInfo({ name, isSelf, isSubscriber });
            setHasSubscribed(isSubscriber);
        })();


    }, [])

    return (
        <>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
                style={{ marginTop: 25, marginBottom: 50 }}
            >
                <Stack
                    direction="row"
                    justifyContent='flex-start'
                    alignItems="center"
                    spacing={2}
                    sx={{ width: 200 }}
                >
                    <Avatar {...StringAvatar(info.name)} />
                    <Typography>{info.name}</Typography>
                </Stack>
                <Button
                    disabled={info.isSelf}
                    variant={hasSubscribed ? 'outlined' : 'contained'}
                    onClick={() => {
                        if (hasSubscribed) {
                            Channel.UnSubscribe(channel);
                            setHasSubscribed(false);
                        } else if (!hasSubscribed) {
                            if (_.isUndefined(socket)) {
                                navigate('/signIn', { state: { from: location, action: 'subscribe', payload: { channel: channel } } });
                            } else {
                                Channel.Subscribe(channel);
                                setHasSubscribed(true);
                            }
                        }
                    }}
                >
                    {hasSubscribed ? '已訂閱' : '訂閱'}
                </Button>
            </Stack>
            <Grid container spacing={2}>
                {
                    _.map(videos, (info, index) => {
                        return (
                            <Grid item key={index}>
                                <Card sx={{ width: 300 }}>

                                    <CardActionArea onClick={() => navigate(`/watch/${info.hash}`)}>

                                        <ImgWithSkeleton height={300 / 1.3} src={`${baseURL}/api/channel/video/cover/${info.hash}`} imgLoaded={imgLoaded} setImgLoaded={setImgLoaded} index={index} />

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
        </>

    )
}