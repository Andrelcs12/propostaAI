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
import { CompanyCommercialForm } from "./company-commercial-form";

type CompanySettingsProps = {
  initialCompany: Company;
};

const tabs = [
  { id: "basic", label: "Empresa" },
  { id: "brand", label: "Identidade visual" },
  { id: "commercial", label: "Dados comerciais" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function CompanySettings({ initialCompany }: CompanySettingsProps) {
  const [company, setCompany] = useState(initialCompany);
  const [activeTab, setActiveTab] = useState<TabId>("basic");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minha empresa</CardTitle>
        <CardDescription>
          Edite a configuracao usada como base para futuras propostas.
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

        {activeTab === "basic" ? (
          <CompanyBasicForm
            company={company}
            submitLabel="Salvar empresa"
            onSaved={setCompany}
          />
        ) : null}
        {activeTab === "brand" ? (
          <CompanyBrandForm
            company={company}
            submitLabel="Salvar identidade visual"
            onSaved={setCompany}
          />
        ) : null}
        {activeTab === "commercial" ? (
          <CompanyCommercialForm
            company={company}
            submitLabel="Salvar dados comerciais"
            onSaved={setCompany}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
