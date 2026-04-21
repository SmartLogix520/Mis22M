import HeroSlider from "../components/HeroSlider";
import BestSellers from "../components/BestSellers";
import Categories from "../components/Categories";
import Favorites from "../components/Favorites";
import AutoScrollGallery from "../components/AutoScrollGallery";
import KeyFeaturesSection from "../components/KeyFeatures";
import Footer from "../../../shared/components/Footer";
import LocationButton from "../components/FindUs";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <BestSellers />
      <LocationButton />
      <Categories />
      <Favorites />
      <LocationButton />
      <AutoScrollGallery />
      <KeyFeaturesSection />
      <Footer />
    </div>
  );
}
