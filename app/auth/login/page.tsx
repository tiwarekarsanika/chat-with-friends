// import { LoginForm } from '~/components/login-form'

// export default function Page() {
//   return (
//     <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm">
//         <LoginForm />
//       </div>
//     </div>
//   )
// }

import React from 'react'
import { LoginForm } from '~/components/login-form'
import Typewriter from "../../../components/Typewriter";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left side with gradient */}
      {/* <div
        className="flex-1 flex items-center justify-center"
        style={{
          background: 'linear-gradient(to bottom, var(--secondary), var(--primary))',
          width: '50vw',
        }}
      >
        <div
          className="text-white text-center"
          style={{
            fontSize: '24px',
            fontWeight: '500',
            padding: '2rem',
          }}
        >
          <Typewriter />
        </div>
      </div> */}


      {/* Right side with login and signup */}
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginPage

