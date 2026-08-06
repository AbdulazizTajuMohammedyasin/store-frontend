import { useEffect, useState } from "react";
import { useCustomer } from "../../hooks/useCustomer";

export default function ProfilePage() {
  const { data, updateCustomer, isUpdating } = useCustomer();

  const customer = data?.data;

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    birth_date: "",
    profile_image: null as File | null,
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

  if (!customer) {
    return (
      <div className="container mt-5">
        <p>Loading profile...</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((previous) => ({
        ...previous,
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

    setEditing(false);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <div className="text-center">
          {customer.profile_image ? (
            <img
              src={customer.profile_image}
              alt="Profile"
              className="rounded-circle mb-3"
              width="120"
              height="120"
            />
          ) : (
            <div
              className="
                  rounded-circle 
                  bg-secondary 
                  text-white 
                  d-flex 
                  align-items-center 
                  justify-content-center 
                  mx-auto 
                  mb-3
                "
              style={{
                width: "120px",
                height: "120px",
                fontSize: "40px",
              }}
            >
              {customer.first_name.charAt(0)}
            </div>
          )}

          {editing ? (
            <>
              <input
                className="form-control mb-2"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </>
          ) : (
            <h3>
              {customer.first_name} {customer.last_name}
            </h3>
          )}

          <p className="text-muted">{customer.email}</p>
        </div>

        <hr />

        {editing && (
          <div className="mb-3">
            <label className="form-label">Profile Image</label>

            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        )}

        <div className="row">
          <div className="col-md-6 mb-3">
            <strong>Phone</strong>

            {editing ? (
              <input
                className="form-control mt-2"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            ) : (
              <p>{customer.phone || "Not provided"}</p>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <strong>Birth Date</strong>

            {editing ? (
              <input
                type="date"
                className="form-control mt-2"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
              />
            ) : (
              <p>{customer.birth_date || "Not provided"}</p>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <strong>Membership</strong>

            <p>{customer.membership}</p>
          </div>
        </div>

        <div className="d-flex gap-2">
          {editing ? (
            <>
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-dark" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
