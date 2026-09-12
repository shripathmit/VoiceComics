import { DormLoungeBackground } from "../../assets/svg/backgrounds/dormLounge";

const BACKGROUNDS: Record<string, () => JSX.Element> = {
  bg_dorm_lounge_day: DormLoungeBackground,
};

export function BackgroundLayer({ backgroundAssetId }: { backgroundAssetId: string }) {
  const Background = BACKGROUNDS[backgroundAssetId] ?? DormLoungeBackground;
  return <Background />;
}
