import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, circInOut } from "framer-motion";
import clsx from "clsx";
import "../css/LoginRegister.css";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";
import { login as loginApi, register as registerApi } from "../services/api";
import { useNavigate } from "react-router-dom";

const illustrationLogin = "/images/login-illustration.jpg";
const illustrationRegister = "/images/register-illustration.jpg";

const tabVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    position: "absolute" as const,
  }),
  animate: {
    x: 0,
    opacity: 1,
    position: "relative" as const,
    transition: { duration: 0.5, ease: circInOut as any },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    position: "absolute" as const,
    transition: { duration: 0.4, ease: circInOut as any },
  }),
};

export default function LoginRegister() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [direction, setDirection] = useState(1);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
    dob: "",
  });

  // Nếu đã đăng nhập thì chuyển hướng sang dashboard
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleTab = (nextTab: "login" | "register") => {
    if (tab !== nextTab) setDirection(nextTab === "login" ? 1 : -1);
    setTab(nextTab);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginApi(loginData.email, loginData.password);
      localStorage.setItem("access_token", result.access_token);
      navigate("/dashboard"); 
    } catch (err: any) {
      alert(err.message);
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await registerApi(registerData);
      localStorage.setItem("access_token", result.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const isLogin = tab === "login";

  return (
    <div className="login-bg">
      <div className="login-container">
        {/* Left Column */}
        <div className={clsx(
          isLogin ? "login-form-col order-1" : "login-illustration order-1"
        )}>
          {isLogin ? (
            <div className="login-form-animate">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key="login"
                  custom={direction}
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <LoginForm
                    data={loginData}
                    onChange={setLoginData}
                    onSubmit={handleLogin}
                    onSwitch={() => handleTab("register")}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <img
              src={illustrationRegister}
              alt="Illustration"
              className="login-img"
            />
          )}
        </div>
        {/* Right Column */}
        <div className={clsx(
          isLogin ? "login-illustration order-2" : "login-form-col order-2"
        )}>
          {isLogin ? (
            <img
              src={illustrationLogin}
              alt="Illustration"
              className="login-img"
            />
          ) : (
            <div className="login-form-animate">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key="register"
                  custom={direction}
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <RegisterForm
                    data={registerData}
                    onChange={setRegisterData}
                    onSubmit={handleRegister}
                    onSwitch={() => handleTab("login")}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}