// page.tsx (Server Component)
import SignInForm from "./SignInFormClient";
import { Suspense } from "react";

export default function SignInPage() {
    return (
        <div>
            <Suspense fallback={<p>Loading form...</p>}>
                <SignInForm />
            </Suspense>
        </div>
    );
}