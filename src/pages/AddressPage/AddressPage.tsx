import { useState } from "react";

import {
  useAddress,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../../hooks/useAddress";
import AddressForm from "../../components/AddressForm";

export default function AddressPage() {
  const { data: address, isLoading } = useAddress();

  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [editing, setEditing] = useState(false);

  if (isLoading) return <p>Loading...</p>;

  if (!address) {
    return (
      <div className="container mt-4">
        <h2>Add Address</h2>

        <AddressForm
          onSubmit={(data) => createAddress.mutate(data)}
          isSubmitting={createAddress.isPending}
        />
      </div>
    );
  }

  if (editing) {
    return (
      <div className="container mt-4">
        <h2>Edit Address</h2>

        <AddressForm
          defaultValues={{
            street: address.street,
            city: address.city,
          }}
          onSubmit={(data) => {
            updateAddress.mutate({
              id: address.id,
              data,
            });

            setEditing(false);
          }}
          isSubmitting={updateAddress.isPending}
        />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>My Address</h2>

      <p>
        <strong>Street:</strong> {address.street}
      </p>

      <p>
        <strong>City:</strong> {address.city}
      </p>

      <button className="btn btn-warning me-2" onClick={() => setEditing(true)}>
        Edit
      </button>

      <button
        className="btn btn-danger"
        onClick={() => deleteAddress.mutate(address.id)}
      >
        Delete
      </button>
    </div>
  );
}
