import React from "react";
import { useReveal } from "../hooks/useReveal";
import { HeroSection } from "../components/home/HeroSection";
import { MissionSection } from "../components/home/MissionSection";
import { StorySection } from "../components/home/StorySection";
import { AudienceSection } from "../components/home/AudienceSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { TimelineSection } from "../components/home/TimelineSection";
import "../styles/home-animations.css"; // Styles additionnels de storytelling

export function Dashboard({ data, onNavigate }) {
  const online = data?.device?.online;
  const moisture = Number.isFinite(data?.sensors?.soilMoisture)
    ? data.sensors.soilMoisture
    : null;

  const root = useReveal();

  return (
    <div className="home-page storytelling-mode" ref={root}>
      {/* 1. Entrée héroïque */}
      <HeroSection
        onNavigate={onNavigate}
        online={online}
        moisture={moisture}
      />

      {/* 2. Le constat / Raison d'être */}
      <MissionSection />

      {/* 3. L'Histoire interactive en 2 actes (Storyline Collage) */}
      <StorySection onNavigate={onNavigate} />

      {/* 4. Pour qui ? (Audience & Impact) */}
      <AudienceSection />

      {/* 5. Les Outils / La solution */}
      <FeaturesSection onNavigate={onNavigate} />

      {/* 6. La méthodologie pas à pas */}
      <TimelineSection onNavigate={onNavigate} />
    </div>
  );
}

export default Dashboard;
