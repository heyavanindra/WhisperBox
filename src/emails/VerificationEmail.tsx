import * as React from "react";

interface EmailVerificationProps {
  username: string;
  verifyCode: string;
}

const EmailTemplate: React.FC<Readonly<EmailVerificationProps>> = ({
  username,
  verifyCode
}) => (
  <div
    style={{ fontFamily: "Arial, sans-serif", color: "#333", padding: "20px" }}
  >
    <h1>Welcome, {username}!</h1>
    <p>We received a request to verify your email address.</p>
    <p>
      Your OTP is: <strong>{verifyCode}</strong>
    </p>
    <p>
      Please enter this OTP to complete your verification. The code is valid for
      10 minutes.
    </p>
    <p>
      If you prefer, you can{" "}
      <a href={`https://whisper.aviii.xyz/verify/${username}`} style={{ color: "#007bff", textDecoration: "none" }}>
        click here
      </a>{" "}
      to verify your account.
    </p>
    <p>If you didn&apos;t request this, please ignore this email.</p>
    <br />
    <p>Best regards,</p>
    <p>The anonymouus team</p>
  </div>
);
export default EmailTemplate