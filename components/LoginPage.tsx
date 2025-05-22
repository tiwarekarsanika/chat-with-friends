import React from 'react'
import LoginCard from '../app/auth/login/page'
import SignUpCard from '../app/auth/sign-up/page'
import Typewriter from "../components/Typewriter";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left side with gradient */}
      <div
        className="flex-1"
        style={{
          background: 'linear-gradient(to bottom, var(--secondary), var(--primary))',
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "500", padding: "2rem" }}>
          <Typewriter />
        </div>
      </div>

      {/* Right side with login and signup */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-black">
        <div className="max-w-md w-full space-y-8">
          <LoginCard />
          <SignUpCard />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
