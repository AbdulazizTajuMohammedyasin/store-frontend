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
    <div className="mb-6">
      <label className="pmck-label mb-2 block">Delivery address</label>

      <div className="mb-2">
        <input
          type="text"
          className="block w-full bg-white pmck-input"
          placeholder="Street address"
          value={value.street}
          onChange={update("street")}
        />
      </div>

      <div>
        <input
          type="text"
          className="block w-full bg-white pmck-input"
          placeholder="City"
          value={value.city}
          onChange={update("city")}
        />
      </div>
    </div>
  );
}
