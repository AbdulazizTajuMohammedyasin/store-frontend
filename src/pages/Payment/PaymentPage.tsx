import { useState, useMemo, useEffect } from "react";
import "./payment.css";
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

const EMPTY_ADDRESS: Address = {
  id: 0,
  street: "",
  city: "",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PaymentPage({
  merchantName = "Dex Shope",
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
      <div className="mx-auto mt-12 w-full max-w-7xl px-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-12 w-full max-w-7xl px-4">
        <p>Something went wrong loading your cart.</p>
      </div>
    );
  }

  if (!cart || cart.cartitem_set.length === 0) {
    return (
      <div className="mx-auto mt-12 w-full max-w-7xl px-4">
        <h3>No items available for payment.</h3>
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
      <div className="pmck-page flex items-center justify-center">
        <div className="px-4 text-center" style={{ maxWidth: 380 }}>
          <div className="pmck-success-icon mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-semibold">Payment successful</h1>
          <p className="mb-0 text-sm text-[#6c757d]">
            {currency(total)} was charged to your card ending in{" "}
            {digits.slice(-4)}. A receipt has been sent to {email}. Redirecting
            to your order…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pmck-page">
      <div className="pmck-test-banner">
        TEST MODE — no real payment will be made
      </div>

      <div className="w-full p-0">
        <div className="grid min-h-screen lg:grid-cols-12">
          {/* ---------------- Left: summary panel ---------------- */}
          <div className="pmck-summary flex flex-col lg:col-span-5">
            <div className="pmck-summary-inner">
              <button
                className="pmck-back-btn mb-6"
                onClick={() => (onBack ? onBack() : navigate("/cart"))}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to cart
              </button>

              <p className="pmck-merchant mb-1">{merchantName}</p>
              <p className="pmck-amount mb-6">{currency(total)}</p>

              <ul className="pmck-item-list mb-6 list-none p-0">
                {cart.cartitem_set.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between py-2"
                  >
                    <div>
                      <div className="pmck-item-title">
                        {item.product.title}
                      </div>
                      <div className="pmck-item-qty">Qty {item.quantity}</div>
                    </div>
                    <div className="pmck-item-price">
                      {currency(item.total_price)}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pmck-divider mb-4" />

              <div className="pmck-line flex justify-between">
                <span>Subtotal</span>
                <span>{currency(subtotal)}</span>
              </div>
              <div className="pmck-line flex justify-between">
                <span>Shipping</span>
                <span>{currency(shipping)}</span>
              </div>
              <div className="pmck-line mb-4 flex justify-between">
                <span>Tax</span>
                <span>{currency(tax)}</span>
              </div>

              <div className="pmck-divider mb-4" />

              <div className="pmck-total flex justify-between">
                <span>Total due</span>
                <span>{currency(total)}</span>
              </div>
            </div>
          </div>

          {/* ---------------- Right: form panel ---------------- */}
          <div className="pmck-form-panel flex items-center lg:col-span-7">
            <div className="pmck-form-inner">
              {orderError && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
                  {orderError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label className="pmck-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="block w-full bg-white pmck-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <AddressForm value={address} onChange={setAddress} />

                <div className="mb-4">
                  <label className="pmck-label" htmlFor="cardNumber">
                    Card information
                  </label>

                  <div className="pmck-card-group">
                    <div className="pmck-card-group-row">
                      <input
                        id="cardNumber"
                        type="text"
                        inputMode="numeric"
                        className="block w-full bg-white pmck-input pmck-card-number"
                        placeholder="1234 1234 1234 1234"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                      />
                      <span className="pmck-card-brand">{brand ?? "💳"}</span>
                    </div>
                    <div className="pmck-card-group-row pmck-card-group-row-split">
                      <input
                        type="text"
                        inputMode="numeric"
                        className="block w-full bg-white pmck-input pmck-card-split"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={(e) =>
                          setExpiry(formatExpiry(e.target.value))
                        }
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        className="block w-full bg-white pmck-input pmck-card-split pmck-card-split-border"
                        placeholder="CVC"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="pmck-label" htmlFor="name">
                    Cardholder name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="block w-full bg-white pmck-input"
                    placeholder="Full name on card"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <label className="pmck-label" htmlFor="country">
                    Country or region
                  </label>
                  <select
                    id="country"
                    className="block w-full bg-white pmck-input"
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

                <button
                  type="submit"
                  className="pmck-pay-btn inline-flex w-full items-center justify-center"
                  disabled={status === "processing"}
                >
                  {status === "processing" ? (
                    <>
                      <span
                        className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
                        role="status"
                      />
                      Processing…
                    </>
                  ) : (
                    <>Pay {currency(total)}</>
                  )}
                </button>

                <p className="pmck-footer-note mt-4 mb-0 text-center">
                  🔒 Payments on this page are simulated for testing — no real
                  card is charged.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
