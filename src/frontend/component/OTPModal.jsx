import { useState, useEffect } from "react";
import './css/OTPModal.css';

export default function OTPModal({ isOpen, onClose, onSubmit, onResend }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  // Handle countdown for resend
  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  // Handle input change
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Handle paste (e.g. 6-digit code at once)
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");
    if (paste.every((ch) => /^[0-9]$/.test(ch))) {
      const newOtp = [...otp];
      paste.forEach((ch, i) => {
        if (i < 6) newOtp[i] = ch;
      });
      setOtp(newOtp);
    }
    e.preventDefault();
  };

  const handleSubmit = () => {
    const code = otp.join("");
    if (code.length === 6) {
      onSubmit(code);
    } else {
      alert("Please enter a 6-digit code");
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      onResend();
      setTimer(60);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Verify Email</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter the 6-digit code sent to your email
        </p>

        <div
          className="flex justify-center space-x-2 mb-4"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-10 h-12 text-center border rounded-lg text-lg"
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`text-sm ${
              timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
            }`}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
          </button>

          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
