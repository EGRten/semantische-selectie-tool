import type { Datasetmanifest, Selectiegegeven, Structuuronderdeel, Zoekterm, Betekenisrelatie } from './typen.js';

// Implementatie wordt tijdens de build uit de bestaande schema's gegenereerd.
export type Validatie<T> = ((data: unknown) => data is T) & {
  errors?: readonly { instancePath: string; message?: string }[] | null;
};
export const manifest: Validatie<Datasetmanifest>;
export const structuur: Validatie<readonly Structuuronderdeel[]>;
export const selectiegegevens: Validatie<readonly Selectiegegeven[]>;

export const zoeklexicon: Validatie<readonly Zoekterm[]>;
export const relaties: Validatie<readonly Betekenisrelatie[]>;
