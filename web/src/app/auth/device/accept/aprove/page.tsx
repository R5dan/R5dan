"use client"

import { useConvexAuth } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "~/server/auth/client";

export default function DeviceApprovalPage() {
  const { isAuthenticated } = useConvexAuth();
  const searchParams = useSearchParams();
  const userCode = searchParams.get("userCode");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  if (!userCode) {
    return <p>Invalid or expired code</p>;
  }

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await authClient.device.approve({
        userCode,
      });
      // Show success message
      alert("Device approved successfully!");
      router.push("/");
    } catch {
      alert("Failed to approve device");
    }
    setIsProcessing(false);
  };

  const handleDeny = async () => {
    setIsProcessing(true);
    try {
      await authClient.device.deny({
        userCode,
      });
      alert("Device denied");
      router.push("/");
    } catch {
      alert("Failed to deny device");
    }
    setIsProcessing(false);
  };

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return router.push(`/login?redirect=/device/approve?user_code=${userCode}`);
  }

  return (
    <div>
      <h2>Device Authorization Request</h2>
      <p>A device is requesting access to your account.</p>
      <p>Code: {userCode}</p>

      <button onClick={handleApprove} disabled={isProcessing}>
        Approve
      </button>
      <button onClick={handleDeny} disabled={isProcessing}>
        Deny
      </button>
    </div>
  );
}
