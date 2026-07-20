"use client";

import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadCompanyLogo } from "../services/company.service";
import { getCurrentAccessToken } from "../services/session-token.service";

type LogoUploadFieldProps = {
  label: string;
  description: string;
  value?: string;
  variant?: "default" | "light";
  disabled?: boolean;
  onChange: (url: string) => void;
};

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

export function LogoUploadField({
  label,
  description,
  value = "",
  variant = "default",
  disabled,
  onChange,
}: LogoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Formato invalido. Use PNG, JPG, WEBP ou SVG.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A logo deve ter no maximo 2 MB.");
      return;
    }

    setIsUploading(true);

    try {
      const accessToken = await getCurrentAccessToken();
      const result = await uploadCompanyLogo(accessToken, file, variant);
      onChange(result.url);
      toast.success("Logo enviada com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel enviar a logo.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      void handleFile(file);
    }
    event.target.value = "";
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      void handleFile(file);
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled && !isUploading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border/80 bg-muted/20",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          disabled={disabled || isUploading}
          className="hidden"
          onChange={onInputChange}
        />

        {value ? (
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center overflow-hidden rounded-xl border bg-background">
                <img
                  src={value}
                  alt={label}
                  className="max-h-14 max-w-14 object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-medium">Logo carregada</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG, JPG, WEBP ou SVG · ate 2 MB
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || isUploading}
                onClick={() => inputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Trocar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled || isUploading}
                onClick={() => onChange("")}
              >
                <Trash2 className="size-4" />
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled || isUploading}
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 px-4 py-8 text-center"
          >
            {isUploading ? (
              <Loader2 className="size-8 animate-spin text-primary" />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ImagePlus className="size-6" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">
                Arraste sua logo ou clique para enviar
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG, WEBP ou SVG · ate 2 MB
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
