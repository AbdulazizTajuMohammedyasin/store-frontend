import { useState, useMemo, useEffect } from "react";
import { Check, ChevronLeft, CreditCard, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { displayTitle, pageContainer, sectionTitle } from "@/lib/Store";
import { useCart } from "../../hooks/useCart";
import { useAddress } from "../../hooks/useAddress";
import { useCreateOrder } from "../../hooks/useOrders";
import { useNavigate } from "react-router-dom";
import AddressForm from "../../components/AddressForm";
import type { Address } from "../../types/address";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PaymentPageProps {
  merchantName?: string;
  shipping?: number;
  taxRate?: number;
  onBack?: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CARD_BRANDS: { test: RegExp; name: string }[] = [
  { test: /^4/, name: "Visa" },
  { test: /^5[1-5]/, name: "Mastercard" },
  { test: /^3[47]/, name: "Amex" },
  { test: /^6(?:011|5)/, name: "Discover" },
];

function detectBrand(digits: string): string | null {
  const match = CARD_BRANDS.find((b) => b.test.test(digits));
  return match ? match.name : null;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

const currency = (n: number) =>
  `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Malaysia",
  "Singapore",
  "Canada",
  "Australia",
];

const field = "h-11 rounded-none";
const cardInput =
  "h-11 w-full min-w-0 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground";

const EMPTY_ADDRESS: Address = {
  id: 0,
  street: "",
  city: "",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PaymentPage({
  merchantName = "DexShop",
  shipping = 8,
  taxRate = 0.08,
  onBack,
}: PaymentPageProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [status, setStatus] = useState<"idle" | "processing" | "success">(
    "idle",
  );
  const [orderError, setOrderError] = useState<string | null>(null);

  const { data, isLoading, error } = useCart();
  const { data: savedAddress } = useAddress();
  const createOrderMutation = useCreateOrder();
  const navigate = useNavigate();

  const cart = data?.data?.[0];

  const digits = cardNumber.replace(/\s/g, "");
  const brand = useMemo(() => detectBrand(digits), [digits]);

  // Prefill street/city from the customer's saved address, once, without
  // overwriting anything the user has already typed.
  useEffect(() => {
    if (!savedAddress) return;

    setAddress((prev) =>
      prev.street === "" && prev.city === ""
        ? {
            id: savedAddress.id,
            street: savedAddress.street,
            city: savedAddress.city,
          }
        : prev,
    );
  }, [savedAddress]);

  // Guard against loading/error/empty-cart states before touching cart fields
  if (isLoading) {
    return (
      <div className={pageContainer}>
        <p className="text-muted-foreground">Loading...</p>
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
          Something went wrong loading your cart.
        </p>
      </div>
    );
  }

  if (!cart || cart.cartitem_set.length === 0) {
    return (
      <div className={pageContainer}>
        <h1 className={sectionTitle}>No items available for payment.</h1>
      </div>
    );
  }

  const subtotal = cart.total_price;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setOrderError(null);
    setStatus("processing");

    // Simulated card processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Payment "succeeded" — now create the real order from the cart
    createOrderMutation.mutate(undefined, {
      onSuccess: (response) => {
        setStatus("success");
        // Give the success screen a beat to show, then move to the order
        setTimeout(() => {
          navigate(`/orders/${response.data.id}`);
        }, 1200);
      },
      onError: () => {
        setStatus("idle");
        setOrderError(
          "Payment went through, but we couldn't create your order. Please contact support.",
        );
      },
    });
  }

  if (status === "success") {
    return (
      <div className={pageContainer}>
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
          <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-success text-white">
            <Check className="size-7" strokeWidth={2.5} />
          </div>
          <h1 className={sectionTitle}>Payment successful</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {currency(total)} was charged to your card ending in{" "}
            {digits.slice(-4)}. A receipt has been sent to {email}. Redirecting
            to your order…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b bg-tile px-4 py-2 text-center text-sm font-medium">
        Test mode — no real payment will be made
      </div>

      <div className={pageContainer}>
        <button
          type="button"
          className="mb-6 inline-flex h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          onClick={() => (onBack ? onBack() : navigate("/cart"))}
        >
          <ChevronLeft className="size-4" />
          Back to cart
        </button>

        <h1 className={`${displayTitle} mb-10`}>Payment</h1>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14">
          {/* ---------------- Summary (first on mobile, right on desktop) ---------------- */}
          <aside className="bg-tile p-6 lg:sticky lg:top-24 lg:order-2">
            <p className="text-sm font-medium text-muted-foreground">
              {merchantName}
            </p>
            <p className="mt-1 text-4xl font-semibold tabular-nums">
              {currency(total)}
            </p>

            <ul className="mt-6 divide-y border-y">
              {cart.cartitem_set.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.product.title}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm whitespace-nowrap tabular-nums">
                    {currency(item.total_price)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{currency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="tabular-nums">{currency(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd className="tabular-nums">{currency(tax)}</dd>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-semibold">
                <dt>Total due</dt>
                <dd className="tabular-nums">{currency(total)}</dd>
              </div>
            </dl>
          </aside>

          {/* ---------------- Form ---------------- */}
          <div className="lg:order-1">
            {orderError && (
              <p
                role="alert"
                className="mb-6 border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {orderError}
              </p>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className={field}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <AddressForm value={address} onChange={setAddress} />

              <fieldset className="space-y-2">
                <legend className="mb-2 text-sm font-medium">
                  Card information
                </legend>

                <div className="border bg-background focus-within:ring-2 focus-within:ring-ring">
                  <div className="relative flex items-center">
                    <label htmlFor="cardNumber" className="sr-only">
                      Card number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      className={cardInput}
                      placeholder="1234 1234 1234 1234"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                    />
                    <span className="pr-3 text-xs font-semibold text-muted-foreground">
                      {brand ?? (
                        <CreditCard className="size-5" aria-hidden="true" />
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 border-t">
                    <label htmlFor="cardExpiry" className="sr-only">
                      Expiry date
                    </label>
                    <input
                      id="cardExpiry"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      className={cardInput}
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    />
                    <label htmlFor="cardCvc" className="sr-only">
                      Security code (CVC)
                    </label>
                    <input
                      id="cardCvc"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      className={`${cardInput} border-l`}
                      placeholder="CVC"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                    />
                  </div>
                </div>
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor="name">Cardholder name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="cc-name"
                  className={field}
                  placeholder="Full name on card"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country or region</Label>
                <select
                  id="country"
                  className={`${field} w-full border bg-background px-3 text-sm`}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-none bg-signal text-base text-signal-foreground hover:bg-signal/85"
                disabled={status === "processing"}
              >
                {status === "processing" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Processing…
                  </>
                ) : (
                  <span className="tabular-nums">Pay {currency(total)}</span>
                )}
              </Button>

              <p className="flex items-start justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <Lock className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                Payments on this page are simulated for testing — no real card
                is charged.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
