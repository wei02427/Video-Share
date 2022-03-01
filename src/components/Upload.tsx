import { useState, ChangeEvent, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { SocketContext } from '../App';
import _ from 'lodash';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';


import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

import Channel from '../api/channel';
import isEmptyString from '../util/isEmptyString';

const steps = ['選擇影片', '上傳'];


function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}


export default function Upload() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<File>();
    const [video, setVideo] = useState<File>();
    const [progress, setProgress] = useState(0);
    const [newVideo, setNewVideo] = useState('');
    const { socket } = useContext(SocketContext);


    useEffect(() => {

        if (!_.isUndefined(socket)) {

            const updateProgress = (progress: number) => {
                setProgress(25 + progress);
            }
            const onUploadFinish = (vid: string) => {
                setNewVideo(vid);
            }

            socket.on("upload_progress", updateProgress);
            socket.on("upload_finish", onUploadFinish);


            return () => {
                socket.off("upload_progress", updateProgress);
                socket.off("upload_finish", onUploadFinish);

            }
        }
    }, [socket])

    const chooseImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const img = event.target.files[0];
            setImage(img);
        }
    };

    const chooseVideo = (event: ChangeEvent<HTMLInputElement>) => {

        if (event.target.files && event.target.files[0]) {
            setVideo(event.target.files[0])
        }
    };

    const onUploadProgress = (data: any) => {
        setProgress(Math.round(data.loaded / data.total) * 25)
    }



    const handleNext = () => {
        switch (activeStep) {
            case 0:
                const formData = new FormData()

                formData.append("video", video!);
                formData.append("img", image!);
                formData.append("title", title);
                formData.append("description", description);
                Channel.UploadVideo(formData, onUploadProgress);

                break;
            default:
                break;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

    };



    const handleReset = () => {
        setTitle('');
        setDescription('');
        setVideo(undefined);
        setImage(undefined);
        setProgress(0);
        setActiveStep(0);
    };

    const checkStepStaust = () => {
        switch (activeStep) {
            case 0:
                return _.isUndefined(image) || _.isUndefined(video) || _.isEmpty(title) || isEmptyString(title) || _.isEmpty(description) || isEmptyString(description);
            default:
                return progress < 100;
        }
    }

    const getUploadStatus = () => {
        if (progress <= 25)
            return `上傳 ${video?.name} 到伺服器`;
        else if (progress <= 50)
            return `FFMpeg 轉為不同畫質`;
        else if (progress <= 75)
            return `MP4Box 轉為 Dash 格式`;
        else if (progress < 100)
            return `儲存到 Cloud Storage`;
        else
            return '完成';

    }
    const stepContent = [

        <Grid container spacing={3} >
            <Grid item xs={5}>

                <ButtonBase
                    disableRipple
                    component="label"
                    style={{
                        width: '100%',
                        aspectRatio: 1.33.toString()
                    }}

                >
                    {_.isUndefined(image)
                        ? <Paper variant="outlined" sx={{ width: '100%', height: '100%', display: 'flex' }} >
                            <div style={{ margin: 'auto' }}>選擇封面 </div>
                        </Paper>
                        : <img src={URL.createObjectURL(image)} width='100%' alt='' />}
                    <input
                        type="file"
                        onChange={chooseImage}
                        accept="image/*"
                        hidden
                    />
                </ButtonBase>
            </Grid>
            <Grid item xs={7}>
                <TextField label="Titile" variant="outlined" margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
                <TextField label="Description" variant="outlined" margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    style={{ marginTop: 50 }}
                >
                    <Typography>{_.isUndefined(video) ? '尚未選擇' : video.name}</Typography>
                    <Button component="label" variant='contained'>
                        選擇影片
                        <input
                            type="file"
                            onChange={(e) => chooseVideo(e)}
                            hidden
                            accept="video/*"
                        />
                    </Button>
                </Stack>

            </Grid>
        </Grid>,
        <Box sx={{ width: '100%' }}>
            <Typography align='left' variant='h6'>{getUploadStatus()}</Typography>
            <LinearProgressWithLabel value={progress} />
        </Box>
    ]
    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} sx={{ marginBottom: 10 }}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};


                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <>
                    <Box display={'flex'} height={400}>

                        <Card sx={{ width: 345, margin: 'auto' }}>
                            <CardActionArea onClick={() => navigate(`/watch/${newVideo}`)}>
                                <CardMedia
                                    component="img"
                                    image={URL.createObjectURL(image!)}
                                    alt=""
                                />
                                <CardContent>
                                    <Typography gutterBottom variant='subtitle1' component="div" align='left'>
                                        {title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align='left' noWrap>
                                        {description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>上傳新影片</Button>
                    </Box>
                </>
            ) : (
                <>
                    <Box height={400}>

                        {stepContent[activeStep]}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>

                        <Box sx={{ flex: '1 1 auto' }} />

                        <Button onClick={handleNext} disabled={checkStepStaust()}>
                            {activeStep === steps.length - 1 ? '完成' : '下一步'}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}