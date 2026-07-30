/**
 * Tipos do domínio "documento institucional".
 *
 * Vivem aqui, e não no módulo de templates, porque o LegalDocumentFrame
 * também será usado por relatórios, fichas, procurações e pela futura
 * geração de PDF.
 */

export type DocumentPageOrientation = "PORTRAIT" | "LANDSCAPE";

export type DocumentPageSettings = {
  format: "A4";
  orientation: DocumentPageOrientation;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  showInstitutionalHeader: boolean;
  showInstitutionalFooter: boolean;
  city: string;
};

export type DocumentSignatureNameSource = "VARIABLE" | "FIXED";

export type DocumentSignature = {
  id?: string;
  label: string;
  nameSource: DocumentSignatureNameSource;
  nameVariable?: string;
  fixedName?: string;
  role?: string;
};

export type OfficeProfileAddress = {
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  postalCode?: string;
};

export type OfficeProfile = {
  name: string;
  legalName?: string;
  documentNumber?: string;
  oabRegistration?: string;
  logoUrl?: string;
  address?: OfficeProfileAddress;
  phone?: string;
  email?: string;
  website?: string;
  headerText?: string;
  footerText?: string;
};

/** Milímetros da folha A4 em retrato. */
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
