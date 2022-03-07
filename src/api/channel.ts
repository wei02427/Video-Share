import api from '../constant/axios';

import _ from 'lodash';
import { baseURL } from '../constant/parameter';
const Channel = {
    UploadVideo: async (formData: FormData, onUploadProgress: (progressEvent: any) => void) => {
        const result = await api.post('/api/channel/upload', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: onUploadProgress

        });
        return result;
    },
    GetChannelLibrary: async (uid?: string) => {
        const result = await api.get(`/api/channel/library/${!_.isUndefined(uid) ? uid : ''}`);
        return result.data;
    },
    GetVideoInfo: async (vid: string) => {
        const result = await api.get('/api/channel/video/info/' + vid);
        return result.data;
    },
    DeleteVideo: async (hash: string) => {
        const result = await api.delete(`/api/channel/video/${hash}`);
        return result;
    },
    Subscribe: async (uid: string) => {
        const result = await api.post(`/api/channel/addSubscriber`, { uid });
        return result;
    },
    UnSubscribe: async (uid: string) => {
        const result = await api.delete(`/api/channel/removeSubscriber/${uid}`);
        return result;
    },
    GetPlayListMPD: (vid: string) => `${baseURL}/api/channel/watch/${vid}/playlist.mpd`,
    GetVideoCover: (vid: string) => `${baseURL}/api/channel/video/cover/${vid}`,

}

export default Channel;