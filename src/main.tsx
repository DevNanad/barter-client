import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup.tsx";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import Trader from './pages/trader/Trader.tsx'
import Advertiser from './pages/advertiser/Advertiser.tsx'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 1250,
      staleTime: 1000 * 60 * 10
    }
  }
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: '',
        element: <Landing/>,
      },
      {
        path: 'signup',
        element: <Signup/>,
      },
      {
        path: 'verify',
        element: <Verify/>,
      },
      {
        path: 'login',
        element: <Login/>,
      },
      {
        path: 'trader',
        element: <Trader/>
      },
      {
        path: 'advertiser',
        element: <Advertiser/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router}/>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
