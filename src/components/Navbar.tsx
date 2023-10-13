import {FaHandHoldingHand} from "react-icons/fa6"

interface UIProps{
    children: React.ReactNode;
}
  
export function Navbar({children}:UIProps): JSX.Element {
    return (
        <nav className="flex text-white  pt-8 px-7 sm:px-20 justify-between items-center">
            <FaHandHoldingHand className="h-12 w-12 drop-shadow-2xl"/>
            <ul className="flex gap-10 font-medium">
            {children}
            </ul>
        </nav>
    );
}
  