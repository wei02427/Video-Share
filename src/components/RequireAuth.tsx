import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom'
import _ from 'lodash';

import Loading from './Loading';
import Account from '../api/account';

export default function RequireAuth({ children }: { children: JSX.Element }) {

    const [isLoggedIn, setIsloggedIn] = useState<boolean>();

    useEffect(() => {
        (async () => {
            Account.Auth()
                .then(res => {
                    setIsloggedIn(res.status === 200);
                })
                .catch(() => {
                    setIsloggedIn(false);

                })
        })()
    }, [])

    const location = useLocation();

    return (
        <Loading
            display={!_.isUndefined(isLoggedIn)}
            element={
                <>
                    {
                        isLoggedIn
                            ? children
                            : <Navigate to="/signIn" state={{ from: location }} replace />
                    }
                </>
            }
        />


    )


}