import type { SoilType } from "../types/soil-type";

export const SOIL_TYPES: readonly SoilType[] = [
  {
    id: 1,
    name: "Песок",
    description:
      "Рыхлый несвязный грунт из минеральных зёрен. Хорошо пропускает воду. При разработке котлована важно учитывать осыпание откосов и уровень грунтовых вод.",
    imageUrl: "/media/sand.jpg",
    videoUrl: "/media/sand.mp4",
    looseningFactor: 1.12,
    density: 1.65,
    likesCount: 12,
    isLiked: 0,
    isMine: 0,
  },
  {
    id: 2,
    name: "Супесь",
    description:
      "Песчаный грунт с небольшой примесью глины. Свойства зависят от влажности: при насыщении водой устойчивость откосов снижается.",
    imageUrl: "/media/sandy-loam.jpg",
    videoUrl: "/media/sandy-loam.mp4",
    looseningFactor: 1.15,
    density: 1.7,
    likesCount: 7,
    isLiked: 0,
    isMine: 0,
  },
  {
    id: 3,
    name: "Суглинок",
    description:
      "Связный грунт со значительным содержанием глинистых частиц. При разработке котлована необходимо учитывать влажность, пластичность и возможное налипание на рабочие органы техники.",
    imageUrl: "/media/loam.jpg",
    videoUrl: "/media/loam.mp4",
    looseningFactor: 1.22,
    density: 1.75,
    likesCount: 9,
    isLiked: 0,
    isMine: 0,
  },
  {
    id: 4,
    name: "Галечник",
    description:
      "Крупнообломочный грунт из окатанных каменных частиц с песчаным заполнителем. Для выбора техники учитываются размер включений и плотность сложения.",
    imageUrl: "/media/gravel.jpg",
    videoUrl: "/media/gravel.mp4",
    looseningFactor: 1.18,
    density: 1.95,
    likesCount: 10,
    isLiked: 0,
    isMine: 0,
  },
  {
    id: 5,
    name: "Известняк",
    description:
      "Скальный грунт осадочного происхождения. Способ разработки зависит от прочности и трещиноватости массива; может потребоваться предварительное рыхление.",
    imageUrl: "/media/rock.jpg",
    videoUrl: "/media/rock.mp4",
    looseningFactor: 1.48,
    density: 2.4,
    likesCount: 6,
    isLiked: 0,
    isMine: 0,
  },
  {
    id: 6,
    name: "Глина",
    description:
      "Связный пластичный грунт с высоким содержанием мелких частиц. При увлажнении свойства заметно меняются. Разработка требует учёта налипания и состояния откосов.",
    imageUrl: "/media/clay.jpg",
    videoUrl: "/media/clay.mp4",
    looseningFactor: 1.3,
    density: 1.8,
    likesCount: 4,
    isLiked: 0,
    isMine: 0,
  },
  {
    id: 9,
    name: "Лёсс",
    description:
      "Пылеватый пористый грунт. При замачивании возможна просадка. Характеристики для конкретного участка уточняются по результатам инженерных изысканий.",
    imageUrl: "",
    videoUrl: "",
    looseningFactor: 1.2,
    density: 1.6,
    likesCount: 3,
    isLiked: 0,
    isMine: 0,
  },
];

export function filterSoilTypes(maxLoosening: number): SoilType[] {
  return SOIL_TYPES.filter((soil) => soil.looseningFactor <= maxLoosening);
}

export function findSoilType(id: string | undefined): SoilType | undefined {
  return SOIL_TYPES.find((soil) => String(soil.id) === id);
}

export function nextSoilType(
  id: number,
  soils: readonly SoilType[],
): SoilType | undefined {
  const index = soils.findIndex((soil) => soil.id === id);
  return index < 0 ? soils[0] : soils[(index + 1) % soils.length];
}
