import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useIdleTimer = (timeout = 15 * 60 * 1000) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // 🔴 Session expired - perform logout
        localStorage.removeItem("token"); // remove auth token
        navigate("/userlogin"); // redirect to login page
      }, timeout);
    };

    // Desktop + Mobile events
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart", "touchmove"];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // start timer at mount

    return () => {
      clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, timeout]);
};

export default useIdleTimer;
