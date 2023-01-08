import type { AppProps } from 'next/app'
import { globalStyles } from '../styles/global'

import Image from 'next/image';

import logo from '../assets/logo.svg'
import { Container, Header } from '../styles/pages/app';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <Container>
      <Header>
        <Image src={logo} alt=''/>
      </Header>
      <Component {...pageProps} />
      <ToastContainer
        progressClassName="toastProgress"
        bodyClassName="toastBody"
      />
    </Container>
  )
}
