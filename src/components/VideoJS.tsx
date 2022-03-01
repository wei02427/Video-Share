import React from "react";
import videojs, { VideoJsPlayer } from "video.js";
import '@videojs/http-streaming/dist/videojs-http-streaming';
import _ from 'lodash';
import "video.js/dist/video-js.css";
import '@videojs/themes/dist/forest/index.css';


require('videojs-contrib-quality-levels');
require('videojs-http-source-selector');
// import "videojs-resolution-switcher";

export const VideoJS = (props: any) => {

    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const playerRef = React.useRef<VideoJsPlayer | null>(null);
    const { options, onReady } = props;


    React.useEffect(() => {


        // make sure Video.js player is only initialized once
        if (!playerRef.current) {

            const videoElement = videoRef.current;
            if (!videoElement) return;

            const player = playerRef.current = videojs(videoElement, options, () => {
                console.log("player is ready");
                onReady && onReady(player);

                (player as any).httpSourceSelector();

            });

        } else if (!_.isEqual(options.sources[0].src, playerRef.current.src())) {
            // you can update player here [update player through props]
            const player = playerRef.current;
            player.pause();
            player.src(options.sources);
            player.load();
            player.play();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    React.useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);



    return (
        <div data-vjs-player style={{ width: '100%' }}>
            <video ref={videoRef} className="video-js vjs-theme-forest vjs-big-play-centered" style={{ width: '100%' }} />
        </div>
    );
}

export default VideoJS;