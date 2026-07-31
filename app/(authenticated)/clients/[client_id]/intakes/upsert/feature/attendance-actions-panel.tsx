"use client";

import { Controller, useFormContext } from "react-hook-form";

import type { ClientAttendanceActionType } from "@/app/generated/prisma/enums";
import { FormPanel } from "@/components/shared/form-panel";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";

import { attendanceActionGroups } from "../data/attendance-action-catalog";
import type { AttendanceFormValues } from "../schemas/attendance-form-schema";

export const AttendanceActionsPanel = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AttendanceFormValues>();

  return (
    <FormPanel
      title="Ações e encaminhamentos"
      description="Selecione as providências definidas. Não é necessário redigir uma descrição."
    >
      <Controller
        control={control}
        name="actions"
        render={({ field }) => {
          const toggle = (value: ClientAttendanceActionType) => {
            field.onChange(
              field.value.includes(value)
                ? field.value.filter((action) => action !== value)
                : [...field.value, value],
            );
          };

          return (
            <div className="grid gap-4">
              {attendanceActionGroups.map((group) => (
                <section key={group.title} className="grid gap-2.5">
                  <div>
                    <h3 className="text-xs font-semibold">{group.title}</h3>

                    <p className="text-xs text-muted-foreground">
                      {group.description}
                    </p>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {group.options.map((option) => {
                      const checked = field.value.includes(option.value);

                      const inputId = `attendance-action-${option.value}`;

                      return (
                        <label
                          key={option.value}
                          htmlFor={inputId}
                          className={cn(
                            "grid min-h-14.5 cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-2.5 rounded-lg border bg-card p-3 hover:bg-muted",
                            checked && "border-primary/45 bg-accent",
                          )}
                        >
                          <Checkbox
                            id={inputId}
                            checked={checked}
                            onCheckedChange={() => toggle(option.value)}
                            className="mt-0.5"
                          />

                          <span>
                            <strong className="block text-xs font-semibold">
                              {option.label}
                            </strong>

                            <small className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
                              {option.description}
                            </small>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              ))}

              {errors.actions ? (
                <FieldError>{errors.actions.message}</FieldError>
              ) : null}
            </div>
          );
        }}
      />
    </FormPanel>
  );
};
