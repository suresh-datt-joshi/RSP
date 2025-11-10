"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  district: string;
  gender: string;
  date_of_birth: string;
  is_active: boolean;
  is_verified: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    country: "",
    state: "",
    district: "",
    gender: "",
    date_of_birth: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name,
        phone: data.phone || "",
        country: data.country,
        state: data.state,
        district: data.district,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to update profile");
      }

      const data = await response.json();
      setProfile(data);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-primary/5 to-white py-12">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="rounded-3xl border border-border bg-white p-8 shadow-lg">
            <p className="text-center text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 to-white py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="rounded-3xl border border-border bg-white p-8 shadow-lg">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your account information
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p className="mt-1 text-lg text-foreground">{profile?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="mt-1 text-lg text-foreground">{profile?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="mt-1 text-lg text-foreground">{profile?.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Gender
                  </label>
                  <p className="mt-1 text-lg capitalize text-foreground">
                    {profile?.gender.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </label>
                  <p className="mt-1 text-lg text-foreground">{profile?.date_of_birth}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Country
                  </label>
                  <p className="mt-1 text-lg text-foreground">{profile?.country}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    State
                  </label>
                  <p className="mt-1 text-lg text-foreground">{profile?.state}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    District
                  </label>
                  <p className="mt-1 text-lg text-foreground">{profile?.district}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => router.push("/predict-yield")}
                  className="flex-1 rounded-lg border-2 border-primary bg-white px-6 py-3 font-semibold text-primary transition hover:bg-primary/5"
                >
                  Predict Yield
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Email (cannot be changed)
                  </label>
                  <input
                    type="email"
                    value={profile?.email}
                    disabled
                    className="mt-1 w-full rounded-lg border border-border bg-gray-100 px-4 py-2 text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    required
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError("");
                  }}
                  className="flex-1 rounded-lg border-2 border-border bg-white px-6 py-3 font-semibold text-foreground transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
