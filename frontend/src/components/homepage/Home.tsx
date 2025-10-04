import AnimalProducts from "./AnimalProducts";
import HeroSection from "./HeroSection";
import LatestCollection from "./LatestCollection";
import LiveAuction from "./LiveAuction";
import RentToolsSection from "./RentToolsSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <LatestCollection />
      <LiveAuction />
      <AnimalProducts />
      <RentToolsSection />
    </div>
  );
};

export default Home;
