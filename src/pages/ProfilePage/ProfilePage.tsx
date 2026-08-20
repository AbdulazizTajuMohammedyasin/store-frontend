import { useEffect, useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useCustomer } from "@/hooks/useCustomer";
import {
  useAddress,
  useCreateAddress,
  useUpdateAddress,
} from "@/hooks/useAddress";
import { pageContainer, pageSubtitle, pageTitle } from "@/lib/Store";

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
        <Skeleton className="h-40 w-full rounded-xl" />
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

  return (
    <div className={pageContainer}>
      <div className="mb-8">
        <h1 className={pageTitle}>Profile</h1>
        <p className={pageSubtitle}>Manage your account details.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <Avatar className="size-24">
            <AvatarImage src={customer.profile_image || undefined} />
            <AvatarFallback className="text-2xl">
              {customer.first_name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 sm:mt-0 sm:ml-6">
            {editing ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <CardTitle className="text-xl">
                {customer.first_name} {customer.last_name}
              </CardTitle>
            )}
            <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Username</Label>
              <p className="mt-1 font-medium">{user?.username}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="mt-1 font-medium">{user?.email}</p>
            </div>
          </div>

          {editing && (
            <div className="space-y-2">
              <Label htmlFor="profile_image">Profile image</Label>
              <Input
                id="profile_image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              {editing ? (
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              ) : (
                <p>{customer.phone || "Not provided"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Birth date</Label>
              {editing ? (
                <Input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                />
              ) : (
                <p>{customer.birth_date || "Not provided"}</p>
              )}
            </div>

            <div>
              <Label className="text-muted-foreground">Membership</Label>
              <p className="mt-1 font-medium">{customer.membership}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 font-semibold">Address</h3>

            {addressLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading address...
              </p>
            ) : editing ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    name="street"
                    value={addressData.street}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
            ) : address ? (
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Street: </span>
                  {address.street}
                </p>
                <p>
                  <span className="text-muted-foreground">City: </span>
                  {address.city}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No address added.</p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {editing ? (
              <>
                <Button
                  className="h-11"
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
                  className="h-11"
                  onClick={() => setEditing(false)}
                >
                  <X className="size-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                className="h-11 w-full sm:w-auto"
                onClick={() => setEditing(true)}
              >
                <Pencil className="size-4" />
                Edit profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
