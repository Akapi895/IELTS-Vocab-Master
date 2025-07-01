import { NavLink, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/my-vocab", label: "My Vocabulary" },
  { to: "/dictionary", label: "Dictionary" },
];

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    } catch {}
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <header className="w-full bg-emerald-600 px-6 py-3 text-white shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Menu giữa */}
        <div className="flex-1 flex justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-20">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.to}>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `transition-all duration-200 font-semibold text-lg !no-underline hover:no-underline ${
                          isActive
                            ? "text-white border-b-2 border-white"
                            : "text-white hover:text-emerald-300 hover:scale-105"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Nút logout */}
        <div className="w-1/10 flex justify-end">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="ml-auto text-white hover:bg-emerald-700 transition-colors flex items-center"
            title="Đăng xuất"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
