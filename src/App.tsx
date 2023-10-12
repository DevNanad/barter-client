import { HelmetProvider } from "react-helmet-async";
import {Outlet} from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <HelmetProvider>
      <div className="bg-[#BEADFA] min-h-screen">
        <Outlet/>
      </div>
    </HelmetProvider>
  )
}

export default App
