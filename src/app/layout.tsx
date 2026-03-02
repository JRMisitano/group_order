import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

import "./globals.css";

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import TopBar from '../components/TopBar';


export const metadata: Metadata = {
  title: "Group Ordering App",
  description: "Order a meal for you and your friends or coworkers.",
};

export default function RootLayout(props) {
  return (
    <html lang="en" >
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <TopBar />
            {props.children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
