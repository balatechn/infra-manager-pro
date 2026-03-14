"use client";

import AppLayout from "@/components/layout/app-layout";
import ProjectDetailPage from "@/components/pages/project-detail";
import { useParams } from "next/navigation";

export default function ProjectDetail() {
  const params = useParams();
  return (
    <AppLayout>
      <ProjectDetailPage projectId={params.id as string} />
    </AppLayout>
  );
}
