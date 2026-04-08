import CatSvg from "./CatSvg";
import DogSvg from "./DogSvg";
import DinosaurSvg from "./DinosaurSvg";
import ButterflySvg from "./ButterflySvg";
import ElephantSvg from "./ElephantSvg";
import FishSvg from "./FishSvg";
import KittyCatSvg from "./KittyCatSvg";
import RoundMonsterSvg from "./RoundMonsterSvg";
import BlueDogSvg from "./BlueDogSvg";
import PrincessSvg from "./PrincessSvg";
import RescuePupSvg from "./RescuePupSvg";
import ChristmasTreeSvg from "./ChristmasTreeSvg";
import EasterEggSvg from "./EasterEggSvg";
import PumpkinSvg from "./PumpkinSvg";
import MandalaSvg from "./MandalaSvg";
import MindfulnessSvg from "./MindfulnessSvg";
import FloralSvg from "./FloralSvg";

// Maps coloring page slug → SVG component
export const coloringSvgMap: Record<string, React.ComponentType> = {
  // Animals
  "cat-coloring-pages": CatSvg,
  "dog-coloring-pages": DogSvg,
  "dinosaur-coloring-pages": DinosaurSvg,
  "butterfly-coloring-pages": ButterflySvg,
  "elephant-coloring-pages": ElephantSvg,
  "fish-coloring-pages": FishSvg,
  // Characters (original designs)
  "hello-kitty-coloring-pages": KittyCatSvg,
  "pokemon-coloring-pages": RoundMonsterSvg,
  "bluey-coloring-pages": BlueDogSvg,
  "disney-coloring-pages": PrincessSvg,
  "paw-patrol-coloring-pages": RescuePupSvg,
  // Holidays
  "christmas-coloring-pages": ChristmasTreeSvg,
  "easter-coloring-pages": EasterEggSvg,
  "halloween-coloring-pages": PumpkinSvg,
  // Adults
  "mandala-coloring-pages": MandalaSvg,
  "mindfulness-colouring": MindfulnessSvg,
  "floral-coloring-pages": FloralSvg,
};
