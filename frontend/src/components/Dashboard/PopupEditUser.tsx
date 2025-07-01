import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface PopupEditUserProps {
  open: boolean;
  onClose: () => void;
  userInfo: any;
  onEditInfo: (data: { name: string; dob: string }) => Promise<void>;
  onChangePassword: (data: { oldPassword: string; newPassword: string }) => Promise<void>;
}

export default function PopupEditUser({
  open,
  onClose,
  userInfo,
  onEditInfo,
  onChangePassword,
}: PopupEditUserProps) {
  const [tab, setTab] = useState<"info" | "password">("info");
  const [info, setInfo] = useState({ name: userInfo?.name || "", dob: userInfo?.dob || "" });
  const [pw, setPw] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onEditInfo(info);
    setLoading(false);
    onClose();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) {
      alert("New password and confirm do not match!");
      return;
    }
    setLoading(true);
    await onChangePassword({ oldPassword: pw.oldPassword, newPassword: pw.newPassword });
    setLoading(false);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setInfo({ name: userInfo?.name || "", dob: userInfo?.dob || "" });
        setPw({ oldPassword: "", newPassword: "", confirm: "" });
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose, userInfo]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex mb-4 border-b">
          <button
            className={`flex-1 py-2 font-semibold ${tab === "info" ? "border-b-2 border-emerald-600 text-emerald-700" : "text-gray-500"}`}
            onClick={() => setTab("info")}
          >
            Edit Info
          </button>
          <button
            className={`flex-1 py-2 font-semibold ${tab === "password" ? "border-b-2 border-emerald-600 text-emerald-700" : "text-gray-500"}`}
            onClick={() => setTab("password")}
          >
            Change Password
          </button>
        </div>
        {tab === "info" ? (
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2 bg-gray-100"
                value={userInfo?.email || ""}
                disabled
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={info.name}
                onChange={e => setInfo({ ...info, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={info.dob}
                onChange={e => setInfo({ ...info, dob: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setInfo({ name: userInfo?.name || "", dob: userInfo?.dob || "" });
                  setPw({ oldPassword: "", newPassword: "", confirm: "" });
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Save
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Current Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={pw.oldPassword}
                onChange={e => setPw({ ...pw, oldPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">New Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={pw.newPassword}
                onChange={e => setPw({ ...pw, newPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={pw.confirm}
                onChange={e => setPw({ ...pw, confirm: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setInfo({ name: userInfo?.name || "", dob: userInfo?.dob || "" });
                  setPw({ oldPassword: "", newPassword: "", confirm: "" });
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Save
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}