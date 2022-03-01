import api from '../constant/axios';

const Account = {
    Login: async (email: string, password: string) => {
        const result = await api.post('/auth/local/login', { email, password });

        return result;
    },
    Logout: async () => {
        const result = await api.get('/auth/local/logout');

        return result;
    },
    Register: async (name: string, email: string, password: string) => {
        const result = await api.post('/auth/local/register',
            { name, email, password });

        return result;
    },
    Auth: async () => {
        const result = await api.get('/auth/local/authenticated');


        return result;
    }
}

export default Account;