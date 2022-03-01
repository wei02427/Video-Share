import { Dispatch, SetStateAction } from 'React';
import Skeleton from '@mui/material/Skeleton';


export default function ImgWithSkeleton({ src, index, imgLoaded, setImgLoaded, height }:
    { height: number, src: string, index: number, imgLoaded: boolean[], setImgLoaded: Dispatch<SetStateAction<boolean[]>> }) {
    return (
        <>
            <img
                width={'100%'}
                src={src}
                onLoad={() => {
                    setImgLoaded(prev => {
                        prev[index] = true;
                        return [...prev];
                    })
                }}
                style={{ display: imgLoaded[index] ? 'block' : 'none' }}
                alt=""
            />
            <Skeleton sx={{ width: '100%', display: !imgLoaded[index] ? 'block' : 'none', height: height }} animation="wave" variant="rectangular" />
        </>

    )
}