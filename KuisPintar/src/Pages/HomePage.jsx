import React from "react";
import MainLayout from "../Layouts/MainLayout";
import HeroSection from "../Sections/HeroSections"; 
import CategorySection from "../Sections/CategorySection";

const HomePage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <CategorySection />
    </MainLayout>
  );
};

export default HomePage;
