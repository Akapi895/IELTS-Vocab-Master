import { useEffect, useState } from "react";
import {
  getUserInfo,
  getUserGoal,
  getUserVocabStatistics,
  updateUserGoal,
} from "../services/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EditGoalPopup from "@/components/Dashboard/EditGoalPopup";
import PopupEditUser from "@/components/Dashboard/PopupEditUser";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [vocabStats, setVocabStats] = useState<any>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [editGoalData, setEditGoalData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const user = await getUserInfo();
        setUserInfo(user);

        const [goalData, stats] = await Promise.all([
          getUserGoal(),
          getUserVocabStatistics(),
        ]);
        setGoal(goalData);
        setVocabStats(stats);
      } catch (err) {
        console.error("Fetch error:", err);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const chartData =
    vocabStats?.progress_chart
      ? Object.entries(vocabStats.progress_chart).map(([day, value]) => ({
          day,
          value,
        }))
      : [];

  // Hàm gọi API cập nhật goal
  const handleEditGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserGoal(editGoalData);
      setShowEditGoal(false);
      // Refresh goal info
      const updatedGoal = await getUserGoal();
      setGoal(updatedGoal);
    } catch (err) {
      alert("Failed to update or create goal");
    }
  };

  // Khi bấm Edit Goal, lấy dữ liệu hiện tại để sửa
  const handleShowEditGoal = () => {
    setEditGoalData(goal
      ? {
          target_band: goal.target_band,
          deadline: goal.deadline,
          current_score: { ...goal.current_score },
          is_active: true,
        }
      : {
          target_band: "",
          deadline: "",
          current_score: { reading: "", listening: "", speaking: "", writing: "" },
          is_active: true,
        }
    );
    setShowEditGoal(true);
  };

  if (loading) return <div className="text-center text-lg p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-emerald-700">DASHBOARD</h2>

      {/* User Information */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
          <CardTitle className="text-2xl font-bold">User Information</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setShowEditPopup(true)}>Edit</Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 text-lg">
          {userInfo ? (
            <>
              <div><b>Email:</b> {userInfo.email}</div>
              <div><b>Name:</b> {userInfo.name}</div>
              <div><b>Date of Birth:</b> {userInfo.dob}</div>
            </>
          ) : (
            <p>No user information.</p>
          )}
        </CardContent>
      </Card>

      {/* Personal Goal */}
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-2xl font-bold">Personal Goal</CardTitle>
          <Button size="default" onClick={handleShowEditGoal}>Edit</Button>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-center">
          {goal ? (
            <>
              <div className="flex justify-between gap-8">
                <div><b>Target band:</b> {goal.target_band}</div>
                <div><b>Deadline:</b> {goal.deadline}</div>
              </div>
              <div>
                <b>Current score:</b>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Object.entries(goal.current_score || {}).map(([key, val]) => (
                    <div key={key} className="p-2 border rounded bg-emerald-50">
                      <div className="font-medium capitalize">{key}</div>
                      <div className="text-emerald-700 font-semibold text-lg">{String(val)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p>You have not set a personal goal.</p>
          )}
        </CardContent>
      </Card>

      {/* Popup Edit Goal */}
      <EditGoalPopup
        open={showEditGoal}
        onClose={() => setShowEditGoal(false)}
        onSubmit={handleEditGoalSubmit}
        editGoalData={editGoalData}
        setEditGoalData={setEditGoalData}
      />

      {/* Popup Edit User */}
      <PopupEditUser
        open={showEditPopup}
        onClose={() => setShowEditPopup(false)}
        userInfo={userInfo}
        onEditInfo={async (data) => {
          // Gọi API cập nhật thông tin user (name, dob)
          const accessToken = localStorage.getItem("access_token");
          await fetch("http://127.0.0.1:8000/api/users/update-info", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
          });
          setUserInfo((prev: any) => ({ ...prev, ...data }));
        }}
        onChangePassword={async (data) => {
          const accessToken = localStorage.getItem("access_token");
          const res = await fetch("http://127.0.0.1:8000/api/users/change-password", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              old_password: data.oldPassword,
              new_password: data.newPassword,
            }),
          });
          if (!res.ok) {
            const err = await res.json();
            alert(err.message || "Current password is incorrect!");
            throw new Error(err.message || "Current password is incorrect!");
          }
        }}
      />

      {/* Vocabulary Statistics + Chart */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold w-full">Vocabulary Statistics</CardTitle>
          <Button onClick={() => navigate("/vocabularyreview")}>Review</Button>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-center">
          {vocabStats ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
              <div><b>Total words:</b><br />{vocabStats.total}</div>
              <div><b>Learned:</b><br />{vocabStats.learned}</div>
              <div><b>High ease:</b><br />{vocabStats.high_ease}</div>
              <div><b>Streak:</b><br />{vocabStats.streak}</div>
            </div>
          ) : (
            <p>No statistics data.</p>
          )}
          <div className="h-64 overflow-x-auto">
            <div className="min-w-[600px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="day" angle={-30} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
