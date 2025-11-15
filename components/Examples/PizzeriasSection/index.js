import BackgroundDecorations from "./BackgroundDecorations";
import PizzeriaSectionHeader from "./PizzeriaSectionHeader";
import PizzeriaSectionSlider from "./PizzeriaSectionSlider";

export default function WarsawSection({ placesData, onCardClick }) {
  return (
    <section className="py-12 w-full">
      <BackgroundDecorations />
      <PizzeriaSectionHeader />
      <PizzeriaSectionSlider
        placesData={placesData}
        onCardClick={onCardClick}
      />
    </section>
  );
}
