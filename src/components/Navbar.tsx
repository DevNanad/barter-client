import {FaHandHoldingHand} from "react-icons/fa6"
import { Link } from "react-router-dom";

interface UIProps{
    children: React.ReactNode;
}
  
export function Navbar({children}:UIProps): JSX.Element {
    return (
        <nav className="flex text-dos  pt-8 px-3 sm:px-20 justify-between items-center">
            <Link to="/">
                <FaHandHoldingHand className="h-8 md:h-12 w-8 md:w-12 drop-shadow-2xl"/>
            </Link>
            <ul className="flex md:gap-10 font-medium dark:text-white">
            {children}
            </ul>
        </nav>
    );
}
  