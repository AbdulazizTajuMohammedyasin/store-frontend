import { useForm } from "react-hook-form";
import type { Address } from "../types/address";

type Props = {
  defaultValues?: Omit<Address, "id">;
  onSubmit: (data: Omit<Address, "id">) => void;
  isSubmitting?: boolean;
};

export default function AddressForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: Props) {
  const { register, handleSubmit } = useForm<Omit<Address, "id">>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label className="form-label">Street</label>
        <input
          {...register("street", { required: true })}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">City</label>
        <input
          {...register("city", { required: true })}
          className="form-control"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        Save Address
      </button>
    </form>
  );
}
