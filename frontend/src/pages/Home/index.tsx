import Hero from "../../components/home/Hero";
import Stats from "../../components/home/Stats";
import Services from "../../components/home/Services";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import AboutPreview from "../../components/home/AboutPreview";
import ContactPreview from "../../components/home/ContactPreview";
import useTitle from "../../hooks/useTitle";

export default function Home() {

  useTitle("Inicio | Tecnocar N&S");

  return (
  <>
  <Hero />
  <Stats />
  <Services />
  <FeaturedProducts />
  <AboutPreview />
  <ContactPreview />
</>
);
}