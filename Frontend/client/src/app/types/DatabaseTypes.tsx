export interface Kategori {
  id: number;
  namn: string;
  beskrivning: string;
}

export interface Produkt {
  id: number;
  artikelnummer: string;
  namn: string;
  pris: number;
  lagerantal: number;
  vikt: number;
  kategori_id: number;
  beskrivning: string;
}

export interface ProduktAttribut {
  id: number;
  produkt_id: number;
  attribut_namn: string;
  attribut_varde: string;
}
