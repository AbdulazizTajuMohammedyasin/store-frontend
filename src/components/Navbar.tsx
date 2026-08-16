import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { neutralLink } from "@/lib/Store";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";

const navLinks = [
  { to: "/collections", label: "Collections" },
  { to: "/products", label: "Products" },
] as const;

function NavItem({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          neutralLink,
          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )
      }
    >
      {label}
    </NavLink>
  );
}

function CartButton({ onClick }: { onClick?: () => void }) {
  const { data: carts } = useCart();
  const cart = carts?.data[0];

  const count =
    cart?.cartitem_set?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <Button variant="outline" size="icon-sm" asChild className="relative">
      <Link
        to="/cart"
        onClick={onClick}
        className="relative !border-0 !shadow-none hover:bg-transparent"
        aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
      >
        <ShoppingCart className="size-4" />

        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    setOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className={cn(
            neutralLink,
            "text-lg font-bold tracking-tight sm:text-xl",
          )}
        >
          DexShop
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavItem key={link.to} to={link.to} label={link.label} />
          ))}

          {user ? (
            <>
              <CartButton />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2 gap-2">
                    <User className="size-4" />
                    {user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className={neutralLink}>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className={neutralLink}>
                      My orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login" className={neutralLink}>
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register" className={neutralLink}>
                  Register
                </Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <CartButton onClick={closeMobile} />}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon-sm" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavItem
                    key={link.to}
                    to={link.to}
                    label={link.label}
                    onClick={closeMobile}
                  />
                ))}

                {user ? (
                  <>
                    <NavItem
                      to="/profile"
                      label="Profile"
                      onClick={closeMobile}
                    />

                    <Button
                      variant="outline"
                      className="mt-4 w-full justify-start gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="mt-4 flex flex-col gap-2">
                    <Button variant="outline" asChild className="w-full">
                      <Link
                        to="/login"
                        className={neutralLink}
                        onClick={closeMobile}
                      >
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link
                        to="/register"
                        className={neutralLink}
                        onClick={closeMobile}
                      >
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
