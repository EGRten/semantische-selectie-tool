// Afgeleid van de bestaande JSON-schema's; veldnamen en optionaliteit zijn brongetrouw.
// De schema's blijven leidend voor runtimevalidatie. Geen datasetwaarden gekopieerd.
export type JsonValue = null | boolean | number | string | ReadonlyArray<JsonValue> | { readonly [key: string]: JsonValue };
export type SelectielijstId = "1996-2012" | "2017" | "2020";

export type Structuuronderdeel = {
  readonly "benaming": string;
  readonly "bron": {
    readonly "bbox": null | ReadonlyArray<JsonValue>;
    readonly "bron_id": string;
    readonly "pdf_pagina": number;
  };
  readonly "code": string;
  readonly "codeopbouw"?: string;
  readonly "id": string;
  readonly "parent_id": null | string;
  readonly "toelichting": null | string;
  readonly "type": string;
  readonly "verificatie"?: string;
  readonly "volgorde": number;
};

export type Selectiegegeven = {
  readonly "aanvangsmoment": {
    readonly "bron"?: {
      readonly "bbox": null;
      readonly "bron_id": string;
      readonly "pdf_pagina": number;
    };
    readonly "officiele_tekst": null | string;
    readonly "status": string;
  };
  readonly "aanvullende_bronnen": ReadonlyArray<{
    readonly "bbox"?: ReadonlyArray<JsonValue> | null;
    readonly "bron_id": string;
    readonly "eindbbox"?: ReadonlyArray<number>;
    readonly "eindpagina"?: number;
    readonly "functie"?: string;
    readonly "kolommen"?: ReadonlyArray<string>;
    readonly "pdf_pagina"?: number;
    readonly "rij"?: number;
    readonly "werkblad"?: string;
  }>;
  readonly "algemene_bepalingen": string;
  readonly "bewaartermijn": {
    readonly "officiele_tekst": string | null;
    readonly "status": string;
    readonly "technisch": null | { readonly [key: string]: JsonValue };
  };
  readonly "bron": {
    readonly "bbox": ReadonlyArray<number>;
    readonly "bron_id": string;
    readonly "eindbbox"?: ReadonlyArray<number>;
    readonly "eindpagina"?: number;
    readonly "pdf_pagina": number;
  };
  readonly "broncontext"?: string;
  readonly "code": string;
  readonly "generiek_specifiek": null | string;
  readonly "herkomst_waardering": null | string;
  readonly "id": string;
  readonly "officiele_benaming": string;
  readonly "officiele_bronrij": {
    readonly "beschrijving_segmenten"?: ReadonlyArray<{
      readonly "bbox": ReadonlyArray<number>;
      readonly "pagina": number;
      readonly "tekst": string;
    }>;
    readonly "bewaartermijn"?: string;
    readonly "code"?: string;
    readonly "generiek_specifiek"?: string;
    readonly "herkomst"?: string;
    readonly "omschrijving"?: string;
    readonly "procesnaam"?: string;
    readonly "procesobject"?: string;
    readonly "procesomschrijving"?: string;
    readonly "procestermijn"?: string;
    readonly "procestoelichting"?: string;
    readonly "procestype"?: string;
    readonly "resultaat"?: string;
    readonly "taakvelden"?: string;
    readonly "termijn_segmenten"?: ReadonlyArray<{
      readonly "bbox": ReadonlyArray<number>;
      readonly "pagina": number;
      readonly "tekst": string;
    }>;
    readonly "toelichting"?: string;
    readonly "waardering"?: string;
  };
  readonly "officiele_omschrijving": string | null;
  readonly "procesobject": null | string;
  readonly "procesomschrijving": null | string;
  readonly "procestermijn": {
    readonly "bron"?: {
      readonly "bron_id": string;
      readonly "kolom": string;
      readonly "rij": number;
      readonly "werkblad": number;
    };
    readonly "generiek_resultaat_id"?: string;
    readonly "legendacategorie"?: string;
    readonly "officiele_tekst": null | string;
    readonly "onderbouwing"?: string;
    readonly "oorspronkelijke_pdf_cel"?: null;
    readonly "status": string;
  };
  readonly "resultaattype": null | string;
  readonly "status": string;
  readonly "structuur_id": string;
  readonly "taakvelden_brontekst": null | string;
  readonly "toelichting": null | string;
  readonly "toepassingsvoorwaarden": {
    readonly "bronvelden": ReadonlyArray<string>;
    readonly "status": string;
  };
  readonly "uitzonderingen_en_verwijzingen": {
    readonly "algemene_bepalingen": ReadonlyArray<string>;
    readonly "officiele_tekst": null | string;
    readonly "status": string;
  };
  readonly "verificatie": {
    readonly "bevindingen": ReadonlyArray<string>;
    readonly "bronannotaties"?: ReadonlyArray<{
      readonly "aanvullende_bronnen": ReadonlyArray<{
        readonly "bbox": ReadonlyArray<number>;
        readonly "bron_id": string;
        readonly "pdf_pagina": number;
      }>;
      readonly "bedoelde_broncorrectie": string;
      readonly "belemmert_oplevering_dataset": boolean;
      readonly "bevinding": string;
      readonly "bron": {
        readonly "bbox": ReadonlyArray<number>;
        readonly "bron_id": string;
        readonly "pdf_pagina": number;
      };
      readonly "bronvarianten": ReadonlyArray<{
        readonly "betekenis": string;
        readonly "bron_id": string;
        readonly "waarde": null | string;
      }>;
      readonly "code": string;
      readonly "controleopdracht_gebruiker": string;
      readonly "id": string;
      readonly "lijst": string;
      readonly "menselijke_bevestiging"?: {
        readonly "beoordelaar": string;
        readonly "datum": string;
        readonly "herkomst": string;
        readonly "oordeel": string;
        readonly "scope": string;
      };
      readonly "onderdeel_id": string;
      readonly "status_verwerking": string;
      readonly "veld": string;
      readonly "verwerking": string;
    }>;
    readonly "menselijke_bevestiging"?: {
      readonly "beoordelaar": string;
      readonly "datum": string;
      readonly "herkomst": string;
      readonly "oordeel": string;
      readonly "scope": string;
    };
    readonly "methode": string;
    readonly "oplevering"?: string;
    readonly "status": string;
  };
  readonly "waardering": {
    readonly "afleiding"?: string;
    readonly "officiele_tekst": string | null;
    readonly "type": string;
  };
};

export type Datasetmanifest = {
  readonly "aantallen": {
    readonly "actieve_regels": number;
    readonly "afgehandelde_bronvragen"?: number;
    readonly "ai_voorgestelde_termrelaties": number;
    readonly "bronannotaties": number;
    readonly "broncontroles_bevestigd_door_gebruiker"?: number;
    readonly "brononderbouwde_alternatieve_termrelaties": number;
    readonly "lege_aanvangsmomentvelden": number;
    readonly "nog_niet_gevalideerde_zoekvoorstellen": number;
    readonly "officiele_termrelaties": number;
    readonly "procestypen": number;
    readonly "records_met_open_bronvraag": number;
    readonly "relaties": number;
    readonly "rubrieken": number;
    readonly "selectievoorschriften_of_resultaatregels": number;
    readonly "structuuronderdelen": number;
    readonly "taalkundige_variantrelaties": number;
    readonly "testvragen": number;
    readonly "vervallen_regels": number;
    readonly "zoektermrelaties": number;
  };
  readonly "beperkingen": ReadonlyArray<string>;
  readonly "bronnenregister": ReadonlyArray<{
    readonly "bestand": string;
    readonly "id": string;
    readonly "sha256": string;
    readonly "status": string;
    readonly "url"?: string;
    readonly "oorspronkelijk_bestand"?: string | null;
    readonly "oorspronkelijke_sha256"?: string | null;
    readonly "bestand_type"?: "bronbeschrijving_geen_brondocument";
    readonly "inhoud_extern"?: true;
  }>;
  readonly "controleoverdracht": {
    readonly "bevestigde_bronoordelen": number;
    readonly "formele_vrijgave_vereist_voor_oplevering": boolean;
    readonly "instructie": string;
    readonly "menselijke_oordelen_vooraf_ingevuld": boolean;
    readonly "status": string;
    readonly "werkboek": string;
  };
  readonly "datasetversie": string;
  readonly "generatiedatum": string;
  readonly "officiele_gegevens_volledigheid": string;
  readonly "officiele_titel": string;
  readonly "opleverstatus": string;
  readonly "selectielijst_id": string;
  readonly "sha256": {
    readonly "bepalingen.json": string;
    readonly "bronannotaties.json": string;
    readonly "codeinventaris.json": string;
    readonly "kandidaten-ongekoppeld.json": string;
    readonly "relaties.csv": string;
    readonly "relaties.json": string;
    readonly "rubriekcontext.json"?: string;
    readonly "selectiegegevens.csv": string;
    readonly "selectiegegevens.json": string;
    readonly "structuur.csv": string;
    readonly "structuur.json": string;
    readonly "testvragen.csv": string;
    readonly "testvragen.json": string;
    readonly "validatie.json": string;
    readonly "wijzigingen.json"?: string;
    readonly "zoeklexicon.csv": string;
    readonly "zoeklexicon.json": string;
  };
  readonly "validatiestatus": {
    readonly "aanvullende_controle": {
      readonly "methode": string;
      readonly "nieuwe_extractieafwijkingen": number;
      readonly "records": number;
    };
    readonly "afgehandelde_bronvragen"?: number;
    readonly "bronbeperkingen_behouden"?: number;
    readonly "broncontroles_bevestigd_door_gebruiker"?: number;
    readonly "bronverificatie": string;
    readonly "integrale_menselijke_tweede_lezing": boolean;
    readonly "open_bronvragen": number;
    readonly "opleverstatus": string;
    readonly "semantische_volledigheid": string;
    readonly "status": string;
    readonly "technische_validatie": string;
    readonly "toepasselijkheidsbeslissingen_gevalideerd": boolean;
    readonly "verplichte_tweede_beoordelaar": boolean;
    readonly "volledigheidscontrole": string;
  };
  readonly "vaststellingsgegevens": {
    readonly "datum": string;
    readonly "kenmerk": string;
    readonly "publicatie": string;
  };
  readonly "publicatievoorbereiding"?: { readonly [key: string]: JsonValue };
};

