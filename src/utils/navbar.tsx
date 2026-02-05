import { Button } from "@/components/ui/button";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import pic from "/game1.png";
// Import the icon (Gamepad2 is a great fit for "Play2Learn")

export function Navbar() {
  return (
    /* Removed default styling with bg-transparent, border-none, and shadow-none */
    <Menubar className="px-4 py-4 sm:px-8 bg-transparent border-none shadow-none flex justify-center">
      <div className="flex items-center justify-between w-full max-w-7xl">
        
        {/* Logo / Title with Icon */}
        <div className="flex items-center gap-2 text-2xl sm:text-3xl font-extrabold text-purple-700">
            <img src={pic} className="w-9 h-9"/>
          <span>Play2Learn</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center space-x-6">
          <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-md transition focus:outline-none ring-0">
            Play
          </Button>
          <a
            href="#contact"
            className="text-lg font-medium text-gray-700 hover:text-purple-600 transition focus:outline-none"
          >
            Contact
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <MenubarMenu>
            <MenubarTrigger className="bg-transparent p-0 focus:bg-transparent data-[state=open]:bg-transparent">
              <Button className="bg-purple-500 text-white px-4 py-2 rounded-md focus:outline-none ring-0">
                Menu
              </Button>
            </MenubarTrigger>
            <MenubarContent className="flex flex-col">
              <MenubarItem>
                <Button className="w-full bg-purple-500 text-white px-6 py-2 rounded-md transition focus:outline-none ring-0">
                  Play
                </Button>
              </MenubarItem>
              <MenubarItem>
                <a
                  href="#contact"
                  className="text-lg font-medium hover:text-purple-600 block w-full py-2 focus:outline-none"
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