import api from '../constant/axios';



const Search = {
    searchVideos: async (keyword: string) => {
        const result = await api.get('/api/search/videos/' + keyword);
        return result.data;
    },
    getAllVideos: async () => {
        const result = await api.get('/api/search/videos')
        return result.data;
    }

}


export default Search;