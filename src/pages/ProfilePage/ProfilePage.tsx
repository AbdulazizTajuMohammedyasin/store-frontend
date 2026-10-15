import { useEffect, useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useCustomer } from "@/hooks/useCustomer";
import {
  useAddress,
  useCreateAddress,
  useUpdateAddress,
} from "@/hooks/useAddress";
import { displayTitle, pageContainer, pageSubtitle } from "@/lib/Store";

/** Readable label for each backend membership code. */
const MEMBERSHIP_LABEL: Record<string, string> = {
  B: "Bronze",
  S: "Silver",
  G: "Gold",
};

const field = "h-11 rounded-none";
const sectionHeading =
  "border-b border-border pb-3 font-display text-xl font-semibold [font-stretch:112%]";
const detailRow = "grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4";

export default function ProfilePage() {
  const { user } = useAuth();

  const { data, updateCustomer, isUpdating } = useCustomer();

  const { data: address, isLoading: addressLoading } = useAddress();

  const createAddress = useCreateAddress();

  const updateAddress = useUpdateAddress();

  const customer = data?.data;

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    birth_date: "",
    profile_image: null as File | null,
  });

  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name,

        last_name: customer.last_name,

        phone: customer.phone || "",

        birth_date: customer.birth_date || "",

        profile_image: null,
      });
    }
  }, [customer]);

  useEffect(() => {
    if (address) {
      setAddressData({
        street: address.street,

        city: address.city,
      });
    }
  }, [address]);

  if (!customer) {
    return (
      <div className={pageContainer}>
        <Skeleton className="h-40 w-full rounded-none" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({
        ...prev,
        profile_image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = () => {
    const form = new FormData();

    form.append("first_name", formData.first_name);

    form.append("last_name", formData.last_name);

    form.append("phone", formData.phone);

    form.append("birth_date", formData.birth_date);

    if (formData.profile_image) {
      form.append("profile_image", formData.profile_image);
    }

    updateCustomer(form);

    if (address) {
      updateAddress.mutate({ id: address.id, data: addressData });
    } else {
      createAddress.mutate(addressData);
    }

    setEditing(false);
  };

  const membership =
    MEMBERSHIP_LABEL[customer.membership] ?? customer.membership;

  // Accounts created by registration start without a name — show the username instead of a blank.
  const displayName =
    `${customer.first_name} ${customer.last_name}`.trim() || user?.username;

  return (
    <div className={pageContainer}>
      <div className="mb-8 sm:mb-10">
        <h1 className={displayTitle}>Profile</h1>
        <p className={pageSubtitle}>Manage your account details.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:gap-12">
        {/* Identity panel */}
        <aside className="flex flex-col items-center bg-tile px-6 py-8 text-center sm:flex-row sm:text-left lg:flex-col lg:items-start lg:self-start">
          <Avatar className="size-24 rounded-none after:rounded-none">
            <AvatarImage
              src={customer.profile_image || undefined}
              alt=""
              className="rounded-none object-cover"
            />
            <AvatarFallback className="rounded-none bg-background text-foreground font-display text-3xl font-extrabold uppercase">
              {displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 min-w-0 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
            <p className="font-display text-xl leading-tight font-semibold break-words [font-stretch:112%]">
              {displayName}
            </p>
            <p className="mt-1 text-sm break-all text-muted-foreground">
              {user?.email}
            </p>
            <p className="mt-4 inline-block bg-background px-2 py-0.5 text-xs font-medium">
              {membership} member
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          {/* Account details */}
          <section aria-labelledby="account-heading">
            <h2 id="account-heading" className={sectionHeading}>
              Account details
            </h2>

            {editing ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      autoComplete="given-name"
                      className={field}
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      autoComplete="family-name"
                      className={field}
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className={field}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Birth date</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      name="birth_date"
                      className={field}
                      value={formData.birth_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile_image">Profile image</Label>
                  <Input
                    id="profile_image"
                    type="file"
                    accept="image/*"
                    className="h-11 rounded-none py-2"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            ) : (
              <dl className="divide-y divide-border">
                <div className={detailRow}>
                  <dt className="text-sm text-muted-foreground">Username</dt>
                  <dd className="font-medium break-words">{user?.username}</dd>
                </div>
                <div className={detailRow}>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="font-medium break-all">{user?.email}</dd>
                </div>
                <div className={detailRow}>
                  <dt className="text-sm text-muted-foreground">Phone</dt>
                  <dd className="font-medium">
                    {customer.phone || "Not provided"}
                  </dd>
                </div>
                <div className={detailRow}>
                  <dt className="text-sm text-muted-foreground">Birth date</dt>
                  <dd className="font-medium tabular-nums">
                    {customer.birth_date || "Not provided"}
                  </dd>
                </div>
                <div className={detailRow}>
                  <dt className="text-sm text-muted-foreground">Membership</dt>
                  <dd className="font-medium">{membership}</dd>
                </div>
              </dl>
            )}
          </section>

          {/* Address */}
          <section aria-labelledby="address-heading" className="mt-10">
            <h2 id="address-heading" className={sectionHeading}>
              Address
            </h2>

            {addressLoading ? (
              <p className="py-4 text-sm text-muted-foreground">
                Loading address...
              </p>
            ) : editing ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    name="street"
                    autoComplete="street-address"
                    className={field}
                    value={addressData.street}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    className={field}
                    value={addressData.city}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
            ) : address ? (
              <dl className="divide-y divide-border">
                <div className={detailRow}>
                  <dt className="text-sm text-muted-foreground">Street</dt>
                  <dd className="font-medium break-words">{address.street}</dd>
                </div>
                <div className={detailRow}>
                  <dt className="text-sm text-muted-foreground">City</dt>
                  <dd className="font-medium break-words">{address.city}</dd>
                </div>
              </dl>
            ) : (
              <p className="py-4 text-sm text-muted-foreground">
                No address added.
              </p>
            )}
          </section>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {editing ? (
              <>
                <Button
                  className="h-12 rounded-none bg-signal px-6 text-signal-foreground hover:bg-signal/85"
                  onClick={handleSubmit}
                  disabled={
                    isUpdating ||
                    updateAddress.isPending ||
                    createAddress.isPending
                  }
                >
                  <Save className="size-4" />
                  {isUpdating ? "Saving..." : "Save changes"}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-none px-6"
                  onClick={() => setEditing(false)}
                >
                  <X className="size-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                className="h-12 w-full rounded-none px-6 sm:w-auto"
                onClick={() => setEditing(true)}
              >
                <Pencil className="size-4" />
                Edit profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
