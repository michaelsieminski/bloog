import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => (
    <div className="flex items-center justify-center w-screen h-screen bg-light">
        <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            appearance={{
                elements: {
                    formButtonPrimary: 'bg-light text-black border hover:bg-light-hover text-sm normal-case',
                    footerActionLink:
                        'text-black hover:no-underline transition hover:text-black opacity-70 hover:opacity-100',
                    logoBox: 'justify-center h-12',
                },
            }}
        />
    </div>
)

export default SignUpPage
