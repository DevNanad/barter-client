import {FaHandHoldingHand} from "react-icons/fa6"
import { Link } from "react-router-dom";

interface UIProps{
    children: React.ReactNode;
}
  
export function Navbar({children}:UIProps): JSX.Element {
    return (
        <nav className="flex text-dos  pt-8 px-7 sm:px-20 justify-between items-center">
            <Link to="/">
                <FaHandHoldingHand className="h-12 w-12 drop-shadow-2xl"/>
            </Link>
            <ul className="flex gap-10 font-medium dark:text-white">
            {children}
            </ul>
        </nav>
    );
}
  