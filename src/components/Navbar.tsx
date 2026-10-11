import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
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

/** Square 44px hit area shared by the header's icon buttons. */
const iconButton =
  "relative size-11 rounded-none border-0 bg-transparent shadow-none hover:bg-muted dark:bg-transparent dark:hover:bg-muted";

function NavItem({
  to,
  label,
  onClick,
  inSheet = false,
}: {
  to: string;
  label: string;
  onClick?: () => void;
  inSheet?: boolean;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          neutralLink,
          "relative flex items-center font-medium transition-colors",
          inSheet
            ? "h-12 border-b px-1 text-base"
            : "h-11 px-3 text-sm after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:bg-foreground after:transition-opacity",
          isActive
            ? "text-foreground after:opacity-100"
            : "text-muted-foreground after:opacity-0 hover:text-foreground",
          isActive && inSheet && "font-semibold",
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
    <Button variant="ghost" size="icon" asChild className={iconButton}>
      <Link
        to="/cart"
        onClick={onClick}
        aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
      >
        <ShoppingCart className="size-5" />

        {count > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-1 right-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold leading-none tabular-nums text-background"
          >
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
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="DexShop home"
          className={cn(
            neutralLink,
            "flex h-11 items-center font-display text-[1.75rem] leading-none font-extrabold tracking-[-0.01em] uppercase [font-stretch:68%]",
          )}
        >
          DexShop
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center md:flex">
          {navLinks.map((link) => (
            <NavItem key={link.to} to={link.to} label={link.label} />
          ))}

          <div className="ml-3 flex items-center border-l pl-3">
            {user ? (
              <>
                <CartButton />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-11 max-w-48 gap-2 rounded-none px-3 text-sm font-medium hover:bg-muted"
                    >
                      <User className="size-4" />
                      <span className="truncate">{user.username}</span>
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
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  asChild
                  className="h-11 rounded-none px-4 hover:bg-muted"
                >
                  <Link to="/login" className={neutralLink}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="h-11 rounded-none px-5">
                  <Link to="/register" className={neutralLink}>
                    Register
                  </Link>
                </Button>
              </div>
            )}
            <ThemeToggle className={iconButton} />
          </div>
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center md:hidden">
          {user && <CartButton onClick={closeMobile} />}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className={iconButton}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm gap-0">
              <SheetHeader className="border-b">
                <SheetTitle className="font-display text-2xl font-extrabold uppercase [font-stretch:68%]">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <nav aria-label="Main" className="flex flex-col px-4">
                {navLinks.map((link) => (
                  <NavItem
                    key={link.to}
                    to={link.to}
                    label={link.label}
                    onClick={closeMobile}
                    inSheet
                  />
                ))}

                {user ? (
                  <>
                    <NavItem
                      to="/profile"
                      label="Profile"
                      onClick={closeMobile}
                      inSheet
                    />
                    <NavItem
                      to="/orders"
                      label="My orders"
                      onClick={closeMobile}
                      inSheet
                    />

                    <Button
                      variant="outline"
                      className="mt-6 h-12 w-full justify-start gap-2 rounded-none"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="mt-6 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      asChild
                      className="h-12 w-full rounded-none"
                    >
                      <Link
                        to="/login"
                        className={neutralLink}
                        onClick={closeMobile}
                      >
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="h-12 w-full rounded-none">
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
