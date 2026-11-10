import type { Datasetmanifest, Selectiegegeven, Structuuronderdeel } from './typen.js';

// Implementatie wordt tijdens de build uit de bestaande schema's gegenereerd.
export type Validatie<T> = ((data: unknown) => data is T) & {
  errors?: readonly { instancePath: string; message?: string }[] | null;
};
export const manifest: Validatie<Datasetmanifest>;
export const structuur: Validatie<readonly Structuuronderdeel[]>;
export const selectiegegevens: Validatie<readonly Selectiegegeven[]>;
