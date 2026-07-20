"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DynamicListFieldProps<T extends { id: string; order?: number }> = {
  label: string;
  items: T[];
  disabled?: boolean;
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (
    item: T,
    index: number,
    update: (next: T) => void,
  ) => React.ReactNode;
};

export function DynamicListField<T extends { id: string; order?: number }>({
  label,
  items,
  disabled,
  onChange,
  createItem,
  renderItem,
}: DynamicListFieldProps<T>) {
  function updateItem(index: number, next: T) {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    const [current] = copy.splice(index, 1);
    if (!current) return;
    copy.splice(target, 0, current);
    onChange(copy.map((item, itemIndex) => ({ ...item, order: itemIndex })));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{label}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onChange([...items, createItem()])}
        >
          <Plus />
          Adicionar
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-6 text-sm text-muted-foreground">
          Nenhum item adicionado.
        </p>
      ) : null}
      {items.map((item, index) => (
        <div key={item.id} className="rounded-md border p-4">
          <div className="mb-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || index === 0}
              onClick={() => moveItem(index, -1)}
            >
              <ArrowUp />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || index === items.length - 1}
              onClick={() => moveItem(index, 1)}
            >
              <ArrowDown />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => removeItem(index)}
            >
              <Trash2 />
            </Button>
          </div>
          {renderItem(item, index, (next) => updateItem(index, next))}
        </div>
      ))}
    </div>
  );
}

export function SimpleListItemEditor({
  title,
  description = "",
  disabled,
  onChange,
}: {
  title: string;
  description?: string;
  disabled?: boolean;
  onChange: (values: { title: string; description?: string }) => void;
}) {
  return (
    <div className="grid gap-3">
      <Input
        disabled={disabled}
        placeholder="Titulo"
        value={title}
        onChange={(event) =>
          onChange({
            title: event.target.value,
            ...(description !== undefined ? { description } : {}),
          })
        }
      />
      <textarea
        className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        disabled={disabled}
        placeholder="Descricao"
        value={description}
        onChange={(event) =>
          onChange({
            title,
            description: event.target.value,
          })
        }
      />
    </div>
  );
}
