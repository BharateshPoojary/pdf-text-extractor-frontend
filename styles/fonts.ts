import {
  Afacad,
  Inter,
  Nunito_Sans,
  Plus_Jakarta_Sans,
  Poppins,
  Red_Hat_Display,
  Syne,
} from "next/font/google";

const afacad = Afacad({
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
});

const poppines = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});
const syne = Syne({
  subsets: ["latin"],
  display: "swap",
});

const redHat = Red_Hat_Display({
  subsets: ["latin"],
  display: "swap",
});
export { afacad, inter, nunitoSans, poppines, plusJakartaSans, syne, redHat };
