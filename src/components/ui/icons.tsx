import {
  ChevronRight,
  SunMedium,
  Moon,
  Laptop,
  LucideProps,
  User,
  Zap,
} from 'lucide-react';

export const Icons = {
  chevronRight: ChevronRight,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  avatar: User,
  zap: Zap,
  logo: ({ ...props }: LucideProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='64.000000pt'
      height='64.000000pt'
      viewBox='0 0 64.000000 64.000000'
      preserveAspectRatio='xMidYMid meet'
      {...props}
    >
      <g
        transform='translate(0.000000,64.000000) scale(0.100000,-0.100000)'
        fill='currentColor'
        stroke='none'
      >
        <path d='M274 535 c-4 -8 -2 -21 4 -28 6 -6 10 -28 10 -48 0 -71 44 -109 128 -109 39 0 51 5 80 34 27 27 34 42 34 73 0 21 5 44 10 49 13 13 2 44 -16 44 -7 0 -28 -9 -46 -20 -42 -25 -93 -25 -141 0 -44 24 -56 25 -63 5z m116 -90 c0 -8 -9 -15 -20 -15 -11 0 -20 7 -20 15 0 8 9 15 20 15 11 0 20 -7 20 -15z m80 0 c0 -8 -9 -15 -20 -15 -11 0 -20 7 -20 15 0 8 9 15 20 15 11 0 20 -7 20 -15z' />
        <path d='M228 363 c-30 -33 -58 -85 -58 -110 0 -9 -19 -34 -42 -54 -37 -32 -41 -38 -29 -53 10 -12 30 -16 77 -16 l64 0 0 33 c0 43 37 106 78 134 l33 22 -30 16 c-17 8 -35 24 -41 35 -14 26 -21 25 -52 -7z' />
        <path d='M444 315 c-110 -35 -163 -84 -169 -156 -2 -25 -10 -45 -21 -54 -32 -23 -4 -36 72 -33 52 2 69 7 69 17 0 8 -15 19 -32 23 -18 5 -33 13 -33 18 0 11 29 40 41 40 18 0 91 74 110 111 28 56 29 55 -37 34z' />
      </g>
    </svg>
  ),
};
