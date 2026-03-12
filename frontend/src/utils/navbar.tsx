import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

// 1. Define the props type
interface NavbarProps {
  onPlayClick: () => void;
}

export function Navbar({ onPlayClick }: NavbarProps) { // 2. Accept the prop
  return (
    <Menubar className="px-4 py-4 sm:px-8 bg-transparent border-none shadow-none flex justify-center">
      <div className="flex items-center justify-between w-full max-w-7xl">
        
        {/* Logo / Title */}
        <div className="flex items-center gap-2 text-2xl sm:text-3xl font-extrabold text-purple-500">
          <img src="/game1.png" className="w-9 h-9" alt="logo" />
          <span>Play2Learn</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center space-x-6">
          <Button 
            onClick={onPlayClick} // 3. Add onClick here
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2 rounded-full transition-all shadow-lg shadow-purple-500/20"
          >
            Play
          </Button>
          <a
            href="#contact"
            className="text-lg font-bold text-gray-400 hover:text-purple-400 transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <MenubarMenu>
            <MenubarTrigger className="bg-transparent p-0 focus:bg-transparent data-[state=open]:bg-transparent">
              <Button className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold">
                Menu
              </Button>
            </MenubarTrigger>
            <MenubarContent className="bg-slate-950 border-white/10 min-w-[150px]">
              <MenubarItem className="focus:bg-transparent">
                <Button 
                  onClick={onPlayClick} // 4. Add onClick here too
                  className="w-full bg-purple-600 text-white font-bold rounded-lg"
                >
                  Play
                </Button>
              </MenubarItem>
              <MenubarItem className="focus:bg-transparent">
                <a
                  href="#contact"
                  className="text-center font-bold text-gray-400 hover:text-purple-400 block w-full py-2"
                >
                  Contact
                </a>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </div>
      </div>
    </Menubar>
  );
}