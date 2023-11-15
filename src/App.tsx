import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Protected from "./Protected";
import TDash from "./pages/trader/TDash";
import Unprotected from "./Unprotected";
import Notfound from "./pages/Notfound";
import Messages from "./pages/trader/Messages";
import Settings from "./pages/trader/Settings";
import Profile from "./pages/trader/Profile";
import Market from "./pages/trader/Market";
import Editprofile from "./pages/trader/Editprofile";
import Editcontact from "./pages/trader/Editcontact";
import Admin from "./pages/admin/Admin";
import Editpassword from "./pages/trader/Editpassword";

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
        path: "*",
        element: <Unprotected element={<Notfound/>}/> 
      },
      {
        path: '',
        element: <Unprotected element={<Landing/>}/>,
      },
      {
        path: 'signup',
        element: <Unprotected element={<Signup/>}/>,
      },
      {
        path: 'verify',
        element: <Unprotected element={<Verify/>}/>
      },
      {
        path: 'login',
        element: <Unprotected element={<Login/>}/>,
      },
      {
        path: 'forgot-password',
        element: <Unprotected element={<Forgot/>}/>
      },
      {
        path: 'reset-password/:id/:token',
        element: <Unprotected element={<Reset/>} />
      },
      
      {
        path: 'trader',
        element: <Protected element={<TDash/>}/>,
        children: [
          {
            path: '',
            element: <Market/>
          },
          {
            path: '/trader/messages',
            element: <Messages/>,
          },
          {
            path: '/trader/settings',
            element: <Settings/>,
            children: [
              {
                path: '',
                element: <Editprofile/>
              },
              {
                path: '/trader/settings/contact',
                element: <Editcontact/>
              },
              {
                path: '/trader/settings/password',
                element: <Editpassword/>
              },
            ]
          },
          {
            path: '/trader/:username',
            element: <Profile/>
          },
        ]
      },
      {
        path: 'admin',
        element: <Protected element={<Admin/>}/> 
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
