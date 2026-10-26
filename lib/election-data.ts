export type CountryResult = {
  id: number;
  name: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  optionOneVotes: number;
  optionTwoVotes: number;
  totalVotes: number;
  optionOnePercentage: number;
  optionTwoPercentage: number;
  leader: "Opção 1" | "Opção 2";
};

export const electionData: CountryResult[] = [
  { id: 1, name: "Alemanha", countryCode: "DEU", region: "Europa", latitude: 51.1657, longitude: 10.4515, optionOneVotes: 16549, optionTwoVotes: 4374, totalVotes: 20923, optionOnePercentage: 79.09, optionTwoPercentage: 20.91, leader: "Opção 1" },
  { id: 2, name: "África do Sul", countryCode: "ZAF", region: "África", latitude: -30.5595, longitude: 22.9375, optionOneVotes: 186, optionTwoVotes: 256, totalVotes: 442, optionOnePercentage: 42.08, optionTwoPercentage: 57.92, leader: "Opção 2" },
  { id: 3, name: "Angola", countryCode: "AGO", region: "África", latitude: -11.2027, longitude: 17.8739, optionOneVotes: 167, optionTwoVotes: 118, totalVotes: 285, optionOnePercentage: 58.6, optionTwoPercentage: 41.4, leader: "Opção 1" },
  { id: 4, name: "Arábia Saudita", countryCode: "SAU", region: "Oriente Médio", latitude: 23.8859, longitude: 45.0792, optionOneVotes: 49, optionTwoVotes: 31, totalVotes: 80, optionOnePercentage: 61.25, optionTwoPercentage: 38.75, leader: "Opção 1" },
  { id: 5, name: "Austrália", countryCode: "AUS", region: "Oceania", latitude: -25.2744, longitude: 133.7751, optionOneVotes: 6017, optionTwoVotes: 3465, totalVotes: 9482, optionOnePercentage: 63.46, optionTwoPercentage: 36.54, leader: "Opção 1" },
  { id: 6, name: "Áustria", countryCode: "AUT", region: "Europa", latitude: 47.5162, longitude: 14.5501, optionOneVotes: 1178, optionTwoVotes: 393, totalVotes: 1571, optionOnePercentage: 74.98, optionTwoPercentage: 25.02, leader: "Opção 1" },
  { id: 7, name: "Bélgica e Luxemburgo", countryCode: "BEL", region: "Europa", latitude: 50.5039, longitude: 4.4699, optionOneVotes: 3064, optionTwoVotes: 2154, totalVotes: 5218, optionOnePercentage: 58.72, optionTwoPercentage: 41.28, leader: "Opção 1" },
  { id: 8, name: "Cabo Verde", countryCode: "CPV", region: "África", latitude: 16.5388, longitude: -23.0418, optionOneVotes: 48, optionTwoVotes: 29, totalVotes: 77, optionOnePercentage: 62.34, optionTwoPercentage: 37.66, leader: "Opção 1" },
  { id: 9, name: "Catar", countryCode: "QAT", region: "Oriente Médio", latitude: 25.3548, longitude: 51.1839, optionOneVotes: 159, optionTwoVotes: 195, totalVotes: 354, optionOnePercentage: 44.92, optionTwoPercentage: 55.08, leader: "Opção 2" },
  { id: 10, name: "China", countryCode: "CHN", region: "Ásia", latitude: 35.8617, longitude: 104.1954, optionOneVotes: 375, optionTwoVotes: 134, totalVotes: 509, optionOnePercentage: 73.67, optionTwoPercentage: 26.33, leader: "Opção 1" },
  { id: 11, name: "Dinamarca", countryCode: "DNK", region: "Europa", latitude: 56.2639, longitude: 9.5018, optionOneVotes: 1383, optionTwoVotes: 243, totalVotes: 1626, optionOnePercentage: 85.06, optionTwoPercentage: 14.94, leader: "Opção 1" },
  { id: 12, name: "Emirados Árabes Unidos", countryCode: "ARE", region: "Oriente Médio", latitude: 23.4241, longitude: 53.8478, optionOneVotes: 643, optionTwoVotes: 772, totalVotes: 1415, optionOnePercentage: 45.44, optionTwoPercentage: 54.56, leader: "Opção 2" },
  { id: 13, name: "Espanha", countryCode: "ESP", region: "Europa", latitude: 40.4637, longitude: -3.7492, optionOneVotes: 9293, optionTwoVotes: 4289, totalVotes: 13582, optionOnePercentage: 68.42, optionTwoPercentage: 31.58, leader: "Opção 1" },
  { id: 14, name: "França", countryCode: "FRA", region: "Europa", latitude: 46.2276, longitude: 2.2137, optionOneVotes: 10676, optionTwoVotes: 2039, totalVotes: 12715, optionOnePercentage: 83.96, optionTwoPercentage: 16.04, leader: "Opção 1" },
  { id: 15, name: "Grécia", countryCode: "GRC", region: "Europa", latitude: 39.0742, longitude: 21.8243, optionOneVotes: 255, optionTwoVotes: 311, totalVotes: 566, optionOnePercentage: 45.05, optionTwoPercentage: 54.95, leader: "Opção 2" },
  { id: 16, name: "Hong Kong", countryCode: "HKG", region: "Ásia", latitude: 22.3193, longitude: 114.1694, optionOneVotes: 127, optionTwoVotes: 133, totalVotes: 260, optionOnePercentage: 48.85, optionTwoPercentage: 51.15, leader: "Opção 2" },
  { id: 17, name: "Irlanda", countryCode: "IRL", region: "Europa", latitude: 53.1424, longitude: -7.6921, optionOneVotes: 7194, optionTwoVotes: 1776, totalVotes: 8970, optionOnePercentage: 80.2, optionTwoPercentage: 19.8, leader: "Opção 1" },
  { id: 18, name: "Israel", countryCode: "ISR", region: "Oriente Médio", latitude: 31.0461, longitude: 34.8516, optionOneVotes: 166, optionTwoVotes: 699, totalVotes: 865, optionOnePercentage: 19.19, optionTwoPercentage: 80.81, leader: "Opção 2" },
  { id: 19, name: "Itália", countryCode: "ITA", region: "Europa", latitude: 41.8719, longitude: 12.5674, optionOneVotes: 7921, optionTwoVotes: 5283, totalVotes: 13204, optionOnePercentage: 59.99, optionTwoPercentage: 40.01, leader: "Opção 1" },
  { id: 20, name: "Japão", countryCode: "JPN", region: "Ásia", latitude: 36.2048, longitude: 138.2529, optionOneVotes: 7014, optionTwoVotes: 28236, totalVotes: 35250, optionOnePercentage: 19.9, optionTwoPercentage: 80.1, leader: "Opção 2" },
  { id: 21, name: "Jordânia", countryCode: "JOR", region: "Oriente Médio", latitude: 30.5852, longitude: 36.2384, optionOneVotes: 725, optionTwoVotes: 76, totalVotes: 801, optionOnePercentage: 90.51, optionTwoPercentage: 9.49, leader: "Opção 1" },
  { id: 22, name: "Líbano", countryCode: "LBN", region: "Oriente Médio", latitude: 33.8547, longitude: 35.8623, optionOneVotes: 2736, optionTwoVotes: 1276, totalVotes: 4012, optionOnePercentage: 68.2, optionTwoPercentage: 31.8, leader: "Opção 1" },
  { id: 23, name: "Moçambique", countryCode: "MOZ", region: "África", latitude: -18.6657, longitude: 35.5296, optionOneVotes: 108, optionTwoVotes: 117, totalVotes: 225, optionOnePercentage: 48, optionTwoPercentage: 52, leader: "Opção 2" },
  { id: 24, name: "Noruega", countryCode: "NOR", region: "Europa", latitude: 60.472, longitude: 8.4689, optionOneVotes: 820, optionTwoVotes: 248, totalVotes: 1068, optionOnePercentage: 76.78, optionTwoPercentage: 23.22, leader: "Opção 1" },
  { id: 25, name: "Nova Zelândia", countryCode: "NZL", region: "Oceania", latitude: -40.9006, longitude: 174.886, optionOneVotes: 418, optionTwoVotes: 101, totalVotes: 519, optionOnePercentage: 80.54, optionTwoPercentage: 19.46, leader: "Opção 1" },
  { id: 26, name: "Países Baixos", countryCode: "NLD", region: "Europa", latitude: 52.1326, longitude: 5.2913, optionOneVotes: 5578, optionTwoVotes: 1383, totalVotes: 6961, optionOnePercentage: 80.13, optionTwoPercentage: 19.87, leader: "Opção 1" },
  { id: 27, name: "Portugal", countryCode: "PRT", region: "Europa", latitude: 39.3999, longitude: -8.2245, optionOneVotes: 34319, optionTwoVotes: 23433, totalVotes: 57752, optionOnePercentage: 59.42, optionTwoPercentage: 40.58, leader: "Opção 1" },
  { id: 28, name: "Reino Unido", countryCode: "GBR", region: "Europa", latitude: 55.3781, longitude: -3.436, optionOneVotes: 10968, optionTwoVotes: 6349, totalVotes: 17317, optionOnePercentage: 63.34, optionTwoPercentage: 36.66, leader: "Opção 1" },
  { id: 29, name: "Suécia", countryCode: "SWE", region: "Europa", latitude: 60.1282, longitude: 18.6435, optionOneVotes: 2127, optionTwoVotes: 591, totalVotes: 2718, optionOnePercentage: 78.26, optionTwoPercentage: 21.74, leader: "Opção 1" },
  { id: 30, name: "Suíça", countryCode: "CHE", region: "Europa", latitude: 46.8182, longitude: 8.2275, optionOneVotes: 7089, optionTwoVotes: 5419, totalVotes: 12508, optionOnePercentage: 56.68, optionTwoPercentage: 43.32, leader: "Opção 1" },
  { id: 31, name: "Tailândia", countryCode: "THA", region: "Ásia", latitude: 15.87, longitude: 100.9925, optionOneVotes: 56, optionTwoVotes: 60, totalVotes: 116, optionOnePercentage: 48.28, optionTwoPercentage: 51.72, leader: "Opção 2" },
  { id: 32, name: "Taiwan", countryCode: "TWN", region: "Ásia", latitude: 23.6978, longitude: 120.9605, optionOneVotes: 94, optionTwoVotes: 130, totalVotes: 224, optionOnePercentage: 41.96, optionTwoPercentage: 58.04, leader: "Opção 2" },
  { id: 33, name: "Turquia", countryCode: "TUR", region: "Europa/Ásia", latitude: 38.9637, longitude: 35.2433, optionOneVotes: 98, optionTwoVotes: 29, totalVotes: 127, optionOnePercentage: 77.17, optionTwoPercentage: 22.83, leader: "Opção 1" },
  { id: 34, name: "Filipinas", countryCode: "PHL", region: "Ásia", latitude: 12.8797, longitude: 121.774, optionOneVotes: 27, optionTwoVotes: 39, totalVotes: 66, optionOnePercentage: 40.91, optionTwoPercentage: 59.09, leader: "Opção 2" },
];

export const summaryStats = {
  totalCountries: electionData.length,
  optionOneWins: electionData.filter((item) => item.leader === "Opção 1").length,
  optionTwoWins: electionData.filter((item) => item.leader === "Opção 2").length,
  totalVoters: electionData.reduce((sum, item) => sum + item.totalVotes, 0),
  optionOneVotes: electionData.reduce((sum, item) => sum + item.optionOneVotes, 0),
  optionTwoVotes: electionData.reduce((sum, item) => sum + item.optionTwoVotes, 0),
};

export function getCountryByName(name: string) {
  return electionData.find((country) => country.name.toLowerCase() === name.toLowerCase());
}
