// page.tsx (Server Component)
import SignInForm from "./SignInFormClient";
import { Suspense } from "react";

export default function SignInPage() {
    return (
        <div>
            <h1>Welcome!</h1>
            <Suspense fallback={<p>Loading form...</p>}>
                <SignInForm />
            </Suspense>
        </div>
    );
}