"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Company } from "../types/company";
import { CompanyBasicForm } from "./company-basic-form";
import { CompanyBrandForm } from "./company-brand-form";
import { CompanyDefaultsForm } from "./company-defaults-form";
import { CompanyIdentityForm } from "./company-identity-form";
import { ProfileTypeForm } from "./profile-type-form";

type SettingsTabsProps = {
  initialCompany: Company;
};

const tabs = [
  { id: "profile", label: "Perfil" },
  { id: "identity", label: "Identidade visual" },
  { id: "defaults", label: "Padroes das propostas" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function SettingsTabs({ initialCompany }: SettingsTabsProps) {
  const [company, setCompany] = useState(initialCompany);
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuracoes</CardTitle>
        <CardDescription>
          Edite as informacoes usadas como base para suas propostas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "profile" ? (
          <div className="space-y-8">
            <ProfileTypeForm
              company={company}
              submitLabel="Salvar tipo de perfil"
              onSaved={setCompany}
            />
            <CompanyBasicForm
              company={company}
              submitLabel="Salvar perfil"
              onSaved={setCompany}
            />
          </div>
        ) : null}

        {activeTab === "identity" ? (
          <div className="space-y-8">
            <CompanyBrandForm
              company={company}
              submitLabel="Salvar identidade visual"
              onSaved={setCompany}
            />
            <CompanyIdentityForm
              company={company}
              submitLabel="Salvar apresentacao comercial"
              onSaved={setCompany}
            />
          </div>
        ) : null}

        {activeTab === "defaults" ? (
          <CompanyDefaultsForm
            company={company}
            submitLabel="Salvar padroes"
            onSaved={setCompany}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
