import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "~/server/auth/client";

export default function DeviceAuthorizationPage() {
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        try {
          // Format the code: remove dashes and convert to uppercase
          const formattedCode = userCode.trim().replace(/-/g, "").toUpperCase();

          // Check if the code is valid using GET /device endpoint
          const response = await authClient.device({
            query: { user_code: formattedCode },
          });

          if (response.data) {
            // Redirect to approval page
            router.push(`/device/approve?user_code=${formattedCode}`);
          }
        } catch {
          setError("Invalid or expired code");
        }
      }}
    >
      <input
        type="text"
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
        placeholder="Enter device code (e.g., ABCD-1234)"
        maxLength={12}
      />
      <button type="submit">Continue</button>
      {error ?? <p>{error}</p>}
    </form>
  );
}
