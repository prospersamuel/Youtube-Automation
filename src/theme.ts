export type Theme = {
  id: string;
  name: string;
  wall: string;
  wall2: string;
  floor: string;
  surface: string;
  line: string;
  skin: string;
  ink: string;
  accent: string;
  accent2: string;
  captionBg: string;
  captionText: string;
};

export const midnight: Theme = {
  id: "a-midnight",
  name: "A · Midnight",
  wall: "#22305A",
  wall2: "#182040",
  floor: "#121830",
  surface: "#2C3B6B",
  line: "#F3EDE2",
  skin: "#F3EDE2",
  ink: "#182040",
  accent: "#FFB13D",
  accent2: "#5ED1C5",
  captionBg: "rgba(10,14,32,0.82)",
  captionText: "#F3EDE2",
};

export const paper: Theme = {
  id: "b-paper",
  name: "B · Paper",
  wall: "#F7ECD9",
  wall2: "#EFDFC4",
  floor: "#E0CBA8",
  surface: "#FFF9EE",
  line: "#2A2933",
  skin: "#FFFDF8",
  ink: "#2A2933",
  accent: "#E8512D",
  accent2: "#2E8C8A",
  captionBg: "rgba(42,41,51,0.92)",
  captionText: "#FFF9EE",
};

export const dusk: Theme = {
  id: "c-dusk",
  name: "C · Dusk",
  wall: "#2B1D4A",
  wall2: "#7A3B78",
  floor: "#241A42",
  surface: "#3B2A63",
  line: "#FFF4E6",
  skin: "#FFF4E6",
  ink: "#2B1D4A",
  accent: "#FFD23F",
  accent2: "#FF7E8F",
  captionBg: "rgba(27,17,50,0.85)",
  captionText: "#FFF4E6",
};
