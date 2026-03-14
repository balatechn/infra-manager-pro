"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatShortDate, getStatusColor } from "@/lib/utils";
import { ArrowLeft, MapPin, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Project } from "@/types";

export default function ProjectDetailPage({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects?id=${encodeURIComponent(projectId)}`)
      .then((r) => r.json())
      .then((p) =>
        setProject({
          id: p.id,
          name: p.name,
          client: p.client,
          location: p.location,
          region: p.region || "South",
          manager: p.manager,
          startDate: p.start_date,
          endDate: p.end_date,
          progress: p.progress || 0,
          status: p.status || "Planned",
          budget: Number(p.budget || 0),
          budgetUsed: Number(p.budget_used || 0),
          description: p.description || "",
          team: p.team || [],
          milestones: (p.milestones || []).map((m: Record<string, unknown>) => ({
            name: m.name as string,
            date: m.date as string,
            status: m.status as string,
          })),
        })
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!project) return <div className="text-slate-400">Project not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <p className="text-sm text-slate-400">{project.id} · {project.client}</p>
        </div>
        <Badge className={getStatusColor(project.status) + " ml-auto"}>{project.status}</Badge>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <MapPin className="w-3 h-3" /> Location
          </div>
          <p className="text-sm text-white font-medium">{project.location}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Calendar className="w-3 h-3" /> Timeline
          </div>
          <p className="text-sm text-white font-medium">
            {formatShortDate(project.startDate)} — {formatShortDate(project.endDate)}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <DollarSign className="w-3 h-3" /> Budget
          </div>
          <p className="text-sm text-white font-medium">
            {formatCurrency(project.budgetUsed)} / {formatCurrency(project.budget)}
          </p>
        </Card>
        <Card className="p-4">
          <div className="text-slate-400 text-xs mb-2">Progress</div>
          <Progress value={project.progress} />
        </Card>
      </div>

      {/* Description */}
      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Team + Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team ({project.team.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.team.map((name) => (
                <div key={name} className="flex items-center gap-2 bg-slate-700/40 rounded-lg px-3 py-2">
                  <Avatar name={name} size="sm" />
                  <span className="text-sm text-slate-300">{name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      m.status === "done"
                        ? "bg-green-500"
                        : m.status === "current"
                        ? "bg-amber-500 animate-pulse"
                        : "bg-slate-600"
                    }`}
                  />
                  <span className="text-sm text-slate-300 flex-1">{m.name}</span>
                  <span className="text-xs text-slate-500">{formatShortDate(m.date)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
