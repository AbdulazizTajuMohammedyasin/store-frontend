import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="border-t bg-tile">
      <div
        className={cn(
          "mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:gap-4 sm:px-6 sm:py-8 sm:text-left sm:text-sm lg:px-8",
          // Logged-in pages show the chat button bottom-right; keep the footer text clear of it.
          user && "pb-20 sm:pb-20 lg:pb-8",
        )}
      >
        <p className="font-medium text-foreground">DexShop</p>
        <p>Quality products, delivered with care.</p>
      </div>
    </footer>
  );
}
