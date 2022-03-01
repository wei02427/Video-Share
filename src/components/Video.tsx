import { useRef, useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { SocketContext } from '../App';
// import { videoJsResolutionSwitcher } from 'videojs-resolution-switcher';
import _ from 'lodash';
import moment from 'moment';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Loading from './Loading';



import { baseURL } from '../constant/parameter';
import Channel from '../api/channel';
import VideoJS from './VideoJS';



import StringAvatar from '../util/stringAvater';


export default function Video() {

    const { socket } = useContext(SocketContext);
    const location = useLocation();

    const navigate = useNavigate();

    const playerRef = useRef(null);
    const params = useParams();

    const { vid } = params;

    const [info, setInfo] = useState<{
        name: string,
        description: string,
        title: string,
        hash: string,
        upload_date: string,
        isSubscriber: boolean | undefined,
        isSelf: boolean | undefined,
        uid: string
    }>();

    const [hasSubscribed, setHasSubscribed] = useState<boolean>(false);

    const videoJsOptions = { // lookup the options in the docs for more options
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: `${baseURL}/api/channel/watch/${vid}/playlist.mpd`,
            type: 'application/dash+xml'
        }],

    }

    const handlePlayerReady = (player: any) => {
        playerRef.current = player;

        // you can handle player events here
        player.on('waiting', () => {
            console.log('player is waiting');
        });

        player.on('dispose', () => {
            console.log('player will dispose');
        });
    };

    useEffect(() => {
        if (vid)
            (async () => {
                const { data } = await Channel.GetVideoInfo(vid);

                setInfo(data);
                setHasSubscribed(data.isSubscriber);
            })()
    }, [vid])


    return (
        <Loading
            display={!_.isUndefined(info)}
            element={

                info ? <>
                    < VideoJS options={videoJsOptions} onReady={handlePlayerReady} />

                    <Typography variant='h6' align='left' gutterBottom sx={{ marginTop: 5 }}>
                        {info.title}
                    </Typography>
                    <Typography variant='body2' align='left' gutterBottom>
                        {moment(info?.upload_date).format('YYYY 年 MM 月 DD 日')}
                    </Typography>


                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        style={{ marginTop: 25 }}
                    >
                        <Stack
                            direction="row"
                            justifyContent='flex-start'
                            alignItems="center"
                            spacing={2}
                        >
                            <Avatar {...StringAvatar(info.name)} />
                            <Link underline="none" href="#" color="inherit">{info.name}</Link>
                        </Stack>
                        <Button
                            disabled={info.isSelf}
                            variant={hasSubscribed ? 'outlined' : 'contained'}
                            onClick={() => {
                                if (hasSubscribed) {
                                    Channel.UnSubscribe(info.uid);
                                    setHasSubscribed(false);
                                } else if (!hasSubscribed) {
                                    if (_.isUndefined(socket)) {
                                        navigate('/signIn', { state: { from: location, action: 'subscribe', payload: { channel: info.uid } } });
                                    } else {
                                        Channel.Subscribe(info.uid);
                                        setHasSubscribed(true);
                                    }
                                }
                            }}
                        >
                            {hasSubscribed ? '已訂閱' : '訂閱'}
                        </Button>
                    </Stack>
                    <Divider sx={{ marginTop: 2 }} />
                    <Box height={100} marginTop={2}>
                        <Typography variant='body1' align='left' gutterBottom>
                            {info.description}
                        </Typography>
                    </Box>

                </> : <></>

            }
        />

    )

}