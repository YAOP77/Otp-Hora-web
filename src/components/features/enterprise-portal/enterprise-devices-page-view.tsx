"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getEnterpriseDevices, registerEnterpriseDevice } from "@/lib/api/devices";
import { getEnterpriseAccessToken } from "@/lib/auth/enterprise-session";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Device = {
  id: string;
  name: string;
  created_at: string;
};

export function EnterpriseDevicesPageView() {
  const { data: devices = [], isLoading } = useQuery({
    queryKey: ["enterprise", "devices"],
    queryFn: async () => {
      const result = await getEnterpriseDevices(getEnterpriseAccessToken);
      return Array.isArray(result) ? result : [];
    },
  });

  const queryClient = useQueryClient();
  const [error, setError] = useState<unknown>(null);
  const [deviceName, setDeviceName] = useState("");

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!deviceName.trim()) {
        throw new Error("Le nom de l'appareil est requis.");
      }
      const fingerprint = `device-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      return registerEnterpriseDevice(
        {
          device_fingerprint: fingerprint,
          device_name: deviceName.trim(),
        },
        getEnterpriseAccessToken,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enterprise", "devices"] });
      setDeviceName("");
      setError(null);
    },
    onError: (err) => {
      setError(err);
    },
  });

  return (
    <div className="w-full space-y-8">
      <PageHeader title="Appareils" description="Administrez les appareils autorisés sur votre espace entreprise." />

      <ErrorBanner error={error} />

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ) : (
      <>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-6">
        <h2 className="mb-4 text-lg font-semibold [color:var(--dash-text)]">Enregistrer un nouvel appareil</h2>

        <div className="grid max-w-xl gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            type="text"
            placeholder="Nom de l'appareil"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
          />
          <Button onClick={() => registerMutation.mutate()} loading={registerMutation.isPending}>
            Enregistrer
          </Button>
        </div>
        <p className="mt-2 text-xs [color:var(--dash-muted)]">API: POST /api/enterprises/me/devices</p>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-6">
        <h2 className="mb-4 text-lg font-semibold [color:var(--dash-text)]">Appareils enregistrés ({devices.length})</h2>

        {devices.length === 0 ? (
          <EmptyState title="Aucun appareil" description="Vous n'avez pas encore enregistré d'appareil." />
        ) : (
          <div className="space-y-2">
            {devices.map((device: Device) => (
              <Card key={device.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium [color:var(--dash-text)]">{device.name}</p>
                    <p className="text-sm text-secondary">{device.id}</p>
                  </div>
                  <p className="text-xs text-secondary">{new Date(device.created_at).toLocaleDateString()}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
      </>
      )}
    </div>
  );
}
