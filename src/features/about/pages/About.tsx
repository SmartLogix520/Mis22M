import { motion } from "framer-motion";
import AboutHeroSection from "../components/AboutHeroSection";
import OurStorySection from "../components/OurStorySection";
import OurMissionSection from "../components/OurMissionSection";
import ScientificApproachSection from "../components/ScientificApproachSection";
import OurCommitmentSection from "../components/OurCommitmentSection";
import LocationButton from "../../../shared/components/FindUs";
import Footer from "../../../shared/components/Footer";

const About = () => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AboutHeroSection />
      <OurStorySection />
      <OurMissionSection />
      <ScientificApproachSection />
      <OurCommitmentSection />
      <LocationButton />
      <Footer />
    </motion.div>
  );
};

export default About;
