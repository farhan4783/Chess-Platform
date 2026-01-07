import { useUser } from '@repo/store/useUser';
import type { Metadata, Player } from '../screens/Game';

interface UserAvatarProps {
  gameMetadata: Metadata | null;
  self?: boolean;
}

export const UserAvatar = ({ gameMetadata, self }: UserAvatarProps) => {
  const user = useUser();
  if (!gameMetadata) return null;
  const whitePlayer = gameMetadata.whitePlayer;
  const blackPlayer = gameMetadata.blackPlayer;
  const player: Player =
    gameMetadata.blackPlayer.id === user.id ? (self ? blackPlayer : whitePlayer) : self ? whitePlayer : blackPlayer;

  return (
    <div className="text-white flex gap-2 ">
      <p>
        {player?.name} {player?.rating ? `(${player.rating})` : ''}
      </p>
      {player?.isGuest && <p className="text-gray-500">[Guest]</p>}
    </div>
  );
};
