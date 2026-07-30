"use client";

import { useRouter } from "next/navigation";
import { GoalSelectionScreen } from "@/components/GoalSelectionScreen";
import { useFlow } from "@/lib/flow-context";
import type { GoalId } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const { setGoalId } = useFlow();

  const handleContinue = (goalId: GoalId) => {
    setGoalId(goalId);
    router.push("/scan");
  };

  return (
    <GoalSelectionScreen
      onContinue={handleContinue}
      onViewHistory={() => router.push("/history")}
    />
  );
}
