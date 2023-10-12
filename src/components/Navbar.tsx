interface UIProps{
    children: React.ReactNode;
  }
  
export function Navbar({children}:UIProps): JSX.Element {
    return (
        <nav className="flex text-white  pt-8 px-5 sm:px-20 justify-between items-center">
            <h1 className="font-bold text-xl">LOGO</h1>
            <ul className="flex gap-10 font-medium">
            {children}
            </ul>
        </nav>
    );
}
  