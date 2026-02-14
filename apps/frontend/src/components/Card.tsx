import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import chessIcon from '../../public/chess.png';
import computerIcon from '../../public/computer.png';
import lightningIcon from '../../public/lightning-bolt.png';
import friendIcon from '../../public/friendship.png';
import tournamentIcon from '../../public/trophy.png';
import variantsIcon from '../../public/strategy.png';
import GameModeComponent from './GameModeComponent';
import { GradientText } from './GradientText';

export function PlayCard() {
  const gameModeData = [
    {
      icon: <img src={lightningIcon} className="inline-block mt-1 h-7 w-7" alt="online" />,
      title: 'Play Online',
      description: 'Play vs a Person of Similar Skill',
      onClick: () => {
        navigate('/game/random');
      },
      disabled: false,
    },
    {
      icon: <img src={computerIcon} className="inline-block mt-1 h-7 w-7" alt="computer" />,
      title: 'Computer',
      description: 'Challenge a bot from easy to master',
      disabled: false,
      onClick: () => {
        navigate('/game/ai');
      },
    },
    {
      icon: <img src={friendIcon} className="inline-block mt-1 h-7 w-7" alt="friend" />,
      title: 'Play a Friend',
      description: 'Invite a Friend to a game of Chess',
      disabled: true,
    },
    {
      icon: <img src={tournamentIcon} className="inline-block mt-1 h-7 w-7" alt="tournament" />,
      title: 'Tournaments',
      description: 'Join an Arena where anyone can Win',
      disabled: true,
    },
    {
      icon: <img src={variantsIcon} className="inline-block mt-1 h-7 w-7" alt="variants" />,
      title: 'Chess Variants',
      description: 'Find Fun New ways to play chess',
      disabled: false,
      onClick: () => {
        navigate('/learn');
      },
    },
  ];

  const navigate = useNavigate();
  return (
    <Card className="glass-strong border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-3 text-center">
        <CardTitle className="font-semibold tracking-wide flex flex-col items-center justify-center">
          <p className="text-white text-3xl">
            Play{' '}
            <GradientText variant="primary" className="inline-block ml-2">
              Chess
            </GradientText>
          </p>
          <img className="pl-1 w-1/2 mt-4 animate-float" src={chessIcon} alt="chess" />
        </CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent className="grid gap-2 cursor-pointer mt-1">
        {gameModeData.map((data, index) => {
          return <GameModeComponent key={index} {...data} />;
        })}
      </CardContent>
    </Card>
  );
}
