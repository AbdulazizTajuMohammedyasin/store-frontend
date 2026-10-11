import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useCart, useUpdateCartItem, useDeleteCartItem } from "@/hooks/useCart";
import {
  displayTitle,
  pageContainer,
  pageSubtitle,
  sectionTitle,
} from "@/lib/Store";

const stepButton =
  "size-11 rounded-none border-border bg-transparent dark:bg-transparent";

function CartMessage({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className={pageContainer}>
      <div className="flex flex-col items-center gap-5 bg-tile px-6 py-16 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" />
        <div>
          <h1 className={sectionTitle}>{title}</h1>
          <p className={pageSubtitle}>{subtitle}</p>
        </div>
        <Button className="h-12 rounded-none px-8" onClick={onAction}>
          {action}
        </Button>
      </div>
    </div>
  );
}

export default function Cart() {
  const { user } = useAuth();
  const { data, isLoading, error } = useCart();
  const updateMutation = useUpdateCartItem();
  const deleteMutation = useDeleteCartItem();
  const navigate = useNavigate();

  if (!user) {
    return (
      <CartMessage
        title="Log in to view your cart"
        subtitle="Your cart is saved to your account."
        action="Log in"
        onAction={() => navigate("/login")}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={pageContainer}>
        <Skeleton className="h-14 w-72 rounded-none" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <Skeleton className="h-48 rounded-none" />
          <Skeleton className="h-48 rounded-none bg-tile" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={pageContainer}>
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          Something went wrong.
        </p>
      </div>
    );
  }

  const cart = data?.data?.[0];

  if (!cart || cart.cartitem_set.length === 0) {
    return (
      <CartMessage
        title="Your cart is empty"
        subtitle="Add products to get started."
        action="Browse products"
        onAction={() => navigate("/products")}
      />
    );
  }

  return (
    <div className={pageContainer}>
      <div className="mb-10">
        <h1 className={displayTitle}>Shopping cart</h1>
        <p className={pageSubtitle}>Review items before checkout.</p>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <ul className="divide-y border-y">
          {cart.cartitem_set.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-4 py-6 sm:grid-cols-[1fr_auto_6rem] sm:gap-x-6"
            >
              <div className="col-span-2 min-w-0 sm:col-span-1">
                <p className="font-display text-base leading-snug font-semibold [font-stretch:112%]">
                  {item.product.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                  £{item.product.price} each
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className={stepButton}
                    aria-label={`Decrease quantity of ${item.product.title}`}
                    onClick={() =>
                      updateMutation.mutate({
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </Button>

                  <span
                    className="flex h-11 min-w-11 items-center justify-center border-y px-2 text-sm font-medium tabular-nums"
                    aria-label={`Quantity ${item.quantity}`}
                  >
                    {item.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className={stepButton}
                    aria-label={`Increase quantity of ${item.product.title}`}
                    onClick={() =>
                      updateMutation.mutate({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="h-11 gap-1.5 rounded-none px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => deleteMutation.mutate(item.id)}
                  aria-label={`Remove ${item.product.title}`}
                >
                  <Trash2 className="size-4" />
                  Remove
                </Button>
              </div>

              <p className="text-right font-semibold tabular-nums">
                £{item.total_price}
              </p>
            </li>
          ))}
        </ul>

        <aside className="space-y-5 bg-tile p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl leading-none font-extrabold uppercase [font-stretch:68%]">
            Summary
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium tabular-nums">£{cart.total_price}</dd>
            </div>
            <div className="flex items-center justify-between border-t pt-3 text-lg font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">£{cart.total_price}</dd>
            </div>
          </dl>
          <Button
            className="h-12 w-full rounded-none bg-signal text-base text-signal-foreground hover:bg-signal/85"
            onClick={() => navigate("/payment")}
          >
            Proceed to payment
          </Button>
        </aside>
      </div>
    </div>
  );
}
