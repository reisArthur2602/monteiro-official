import { FormPanel } from "@/components/shared/form-panel";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

type SystemItemProps = {
  label: string;
  value: string;
};

const SystemItem = ({ label, value }: SystemItemProps) => (
  <div className="grid gap-1.5 rounded-lg border bg-muted p-3.5">
    <span className="font-mono text-[8px] font-semibold tracking-wider text-muted-foreground uppercase">
      {label}
    </span>

    <strong className="text-xs">{value}</strong>
  </div>
);

type AttendanceSystemPanelProps = {
  /** Data/hora do atendimento: "agora" na criação, gravada na edição. */
  attendanceAt: Date;
  responsibleName: string;
};

/**
 * Data, horário e responsável não são campos do formulário — vêm da
 * sessão e do relógio do servidor, nunca de entrada do usuário.
 */
export const AttendanceSystemPanel = ({
  attendanceAt,
  responsibleName,
}: AttendanceSystemPanelProps) => (
  <FormPanel
    title="Registro automático"
    description="Data, horário e responsável são definidos pelo servidor."
  >
    <div className="grid gap-3 sm:grid-cols-3">
      <SystemItem
        label="Data do atendimento"
        value={dateFormatter.format(attendanceAt)}
      />

      <SystemItem label="Horário" value={timeFormatter.format(attendanceAt)} />

      <SystemItem
        label="Responsável pelo atendimento"
        value={responsibleName}
      />
    </div>
  </FormPanel>
);
