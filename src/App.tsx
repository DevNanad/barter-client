import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Trader from "./pages/trader/Trader";
import Advertiser from "./pages/advertiser/Advertiser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Protected from "./Protected";

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
    element: <Layout/>,
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
        path: 'forgot-password',
        element: <Forgot/>
      },
      {
        path: 'reset-password/:id/:token',
        element: <Reset/>
      },
      {
        path: 'trader',
        element: <Protected element={<Trader/>}/>
      },
      {
        path: 'advertiser',
        element: <Protected element={<Advertiser/>}/> 
      }
    ]
  }
])

function App() {
  return (
    <>
      <QueryClientProvider client={client}>
        <RouterProvider router={router}/>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}

export default App
