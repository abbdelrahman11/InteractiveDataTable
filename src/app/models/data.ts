export interface TableData {
  name: Name;
  independent: boolean;
  status: string;
  currencies: Currencies;
  capital: string[];
}
interface Name {
  common: string;
  official: string;
  nativeName: NativeName;
}

interface NativeName {
  eng: Eng;
  jam: Jam;
}

interface Eng {
  official: string;
  common: string;
}

interface Jam {
  official: string;
  common: string;
}

interface Currencies {
  [currencyCode: string]: {
    name: string;
    symbol: string;
  };
}
interface Jmd {
  name: string;
  symbol: string;
}
