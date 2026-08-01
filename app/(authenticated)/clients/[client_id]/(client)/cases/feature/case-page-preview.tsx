import { cn } from "@/lib/utils";

type CasePagePreviewProps = {
  /** Linha superior da folha, ex.: "JUDICIAL · CÍVEL". */
  heading: string;
  internalCode: string;
  rotateAlternate: boolean;
};

/**
 * Balança da Justiça desenhada com elementos posicionados, como no
 * protótipo. É decorativa — daí o `aria-hidden` no contêiner.
 */
const MiniScale = () => (
  <div
    aria-hidden="true"
    className="relative mx-auto mt-0.5 mb-1.5 h-[31px] w-[34px] text-[#17349d]/28"
  >
    <span className="absolute top-[3px] bottom-[5px] left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-current" />
    <span className="absolute top-2 left-[3px] h-0.5 w-7 rounded-full bg-current" />

    <span className="absolute top-2.5 left-1.5 h-[9px] w-px bg-current" />
    <span className="absolute top-2.5 right-1.5 h-[9px] w-px bg-current" />

    <span className="absolute top-[18px] left-0 h-[5px] w-3 rounded-b-[10px] border-[1.5px] border-t-0 border-current" />
    <span className="absolute top-[18px] right-0 h-[5px] w-3 rounded-b-[10px] border-[1.5px] border-t-0 border-current" />

    <span className="absolute bottom-0.5 left-1/2 h-[3px] w-[18px] -translate-x-1/2 rounded-full bg-current" />
  </div>
);

/**
 * Mockup decorativo da capa do processo, no estilo carta timbrada — mesmo
 * papel do mockup usado nos cards de ficha, aqui com a balança e o código
 * interno do processo.
 */
export const CasePagePreview = ({
  heading,
  internalCode,
  rotateAlternate,
}: CasePagePreviewProps) => (
  <div
    className={cn(
      "relative mx-auto min-h-[166px] w-[132px] border border-[#d8ddd9] bg-white p-[16px_14px] font-heading text-[#18201d] shadow-[0_12px_28px_rgba(11,18,32,0.14)]",
      rotateAlternate ? "rotate-[0.8deg]" : "-rotate-[1deg]",
    )}
  >
    <div className="mb-2 flex items-center gap-1.5 border-b border-[#17349d] pb-1.5 text-[6px] font-semibold text-[#17349d]">
      <span className="grid size-3.5 place-items-center rounded border border-[#17349d] text-[8px] leading-none">
        §
      </span>
      <span>MONTEIRO ADVOCACIA</span>
    </div>

    <MiniScale />

    <h4 className="mb-[5px] text-center text-[6px] tracking-wide text-[#17349d] uppercase">
      {heading}
    </h4>

    <span className="mb-[7px] block truncate text-center font-mono text-[5.5px] text-[#6a7484]">
      {internalCode}
    </span>

    <div className="mb-[5px] h-[3px] rounded-full bg-[#d9dfdc]" />
    <div className="mb-[5px] h-[3px] w-[82%] rounded-full bg-[#d9dfdc]" />
    <div className="h-[3px] w-[60%] rounded-full bg-[#d9dfdc]" />

    <div className="mt-2 grid grid-cols-2 gap-[5px]">
      <span className="h-3 rounded-[2px] border border-[#d9dfdc] bg-[#fafbf9]" />
      <span className="h-3 rounded-[2px] border border-[#d9dfdc] bg-[#fafbf9]" />
      <span className="h-3 rounded-[2px] border border-[#d9dfdc] bg-[#fafbf9]" />
      <span className="h-3 rounded-[2px] border border-[#d9dfdc] bg-[#fafbf9]" />
    </div>
  </div>
);
