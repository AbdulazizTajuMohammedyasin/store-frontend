import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Address } from "../types/address";

interface Props {
  value: Address;
  onChange: (value: Address) => void;
}

export default function AddressForm({ value, onChange }: Props) {
  const update =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [field]: e.target.value });

  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-medium">Delivery address</legend>

      <div className="space-y-1.5">
        <Label htmlFor="address-street" className="text-xs text-muted-foreground">
          Street address
        </Label>
        <Input
          id="address-street"
          type="text"
          autoComplete="street-address"
          className="h-11 rounded-none"
          placeholder="Street address"
          value={value.street}
          onChange={update("street")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address-city" className="text-xs text-muted-foreground">
          City
        </Label>
        <Input
          id="address-city"
          type="text"
          autoComplete="address-level2"
          className="h-11 rounded-none"
          placeholder="City"
          value={value.city}
          onChange={update("city")}
        />
      </div>
    </fieldset>
  );
}
