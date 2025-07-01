import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface EditGoalPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editGoalData: any;
  setEditGoalData: (data: any) => void;
}

export default function EditGoalPopup({
  open,
  onClose,
  onSubmit,
  editGoalData,
  setEditGoalData,
}: EditGoalPopupProps) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        className="bg-white rounded-lg p-6 w-full max-w-md space-y-4"
        onSubmit={onSubmit}
      >
        <h3 className="text-xl font-bold mb-2">Edit Personal Goal</h3>
        <div>
          <label className="block font-medium mb-1">Target band</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={editGoalData?.target_band ?? ""}
            onChange={e => setEditGoalData((prev: any) => ({ ...prev, target_band: parseFloat(e.target.value) }))}
            required
          >
            <option value="">Select</option>
            {Array.from({ length: 17 }, (_, i) => {
              const val = 1 + i * 0.5;
              return (
                <option key={val} value={val}>
                  {val.toFixed(1)}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Deadline</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={editGoalData?.deadline ?? ""}
            onChange={e => setEditGoalData((prev: any) => ({ ...prev, deadline: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Current score</label>
          {["reading", "listening", "speaking", "writing"].map((skill) => (
            <div key={skill} className="flex items-center gap-2 mb-1">
              <span className="capitalize w-20">{skill}:</span>
              <select
                className="border rounded px-2 py-1 flex-1"
                value={editGoalData?.current_score?.[skill] ?? ""}
                onChange={e =>
                  setEditGoalData((prev: any) => ({
                    ...prev,
                    current_score: {
                      ...prev.current_score,
                      [skill]: parseFloat(e.target.value),
                    },
                  }))
                }
                required
              >
                <option value="">Select</option>
                {Array.from({ length: 17 }, (_, i) => {
                  const val = 1 + i * 0.5;
                  return (
                    <option key={val} value={val}>
                      {val.toFixed(1)}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}