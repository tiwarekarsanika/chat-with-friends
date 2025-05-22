// import { SignUpForm } from '~/components/sign-up-form'

// export default function Page() {
//   return (
//     <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm">
//         <SignUpForm />
//       </div>
//     </div>
//   )
// }


import { SignUpForm } from '~/components/sign-up-form'
import React from 'react'
import Typewriter from "../../../components/Typewriter";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left side with gradient */}
      {/* <div
        className="flex-1"
        style={{
          background: 'linear-gradient(to bottom, var(--secondary), var(--primary))',
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "500", padding: "2rem" }}>
          <Typewriter />
        </div>
      </div> */}

      {/* Right side with login and signup */}
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}

export default SignUpPage

