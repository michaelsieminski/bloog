import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
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
