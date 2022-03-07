import { createContext, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { io, Socket } from "socket.io-client";

import './App.css';
import Container from '@mui/material/Container';
import Header from './components/Header';
import Index from './components/Index';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Video from './components/Video';
import RequireAuth from './components/RequireAuth';
import Channel from './components/Channel';
import User from './components/User';
import Search from './components/Search';



import Account from './api/account';
import { baseURL } from './constant/parameter';
const defaultSocket = { socket: undefined, setSocket: (socket: Socket) => { }, resetSocket: () => { }, connectSocket: (userName: string) => { } };
export const SocketContext = createContext<{ socket: Socket | undefined, setSocket: (socket: Socket) => void, resetSocket: () => void, connectSocket: (userName: string) => void }>(defaultSocket);
export const LogInContext = createContext(false);


function App() {


  const [socket, setSocket] = useState<Socket>();
  const [userName, setUserName] = useState('');

  const connectSocket = (username: string) => {
    const newSocket = io(baseURL, { withCredentials: true });
    newSocket.emit('new_socket');
    setSocket(newSocket);
    setUserName(username)
  }

  useEffect(() => {
    (async () => {
      Account.Auth()
        .then(res => {
          connectSocket(res.data.data.name);
        })
        .catch(() => {
        })
    })()
  }, [])


  return (
    <div className="App">
      <SocketContext.Provider value={{ socket, setSocket, connectSocket, resetSocket: () => setSocket(undefined) }}>
        <BrowserRouter>
          <Header userName={userName} />
          <Container maxWidth='xl'>

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="signIn" element={<SignIn />} />
              <Route path="signUp" element={<SignUp />} />
              <Route path="watch/:vid" element={<Video />} />
              <Route path="user/:channel" element={<User />} />
              <Route path="search/:keyword" element={<Search />} />

              <Route path="channel/*" element={
                <RequireAuth>
                  <Channel />
                </RequireAuth>
              } />
            </Routes>
          </Container>

        </BrowserRouter>


      </SocketContext.Provider>


    </div >
  );
}

export default App;
