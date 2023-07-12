import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { useState } from 'react';

type props = {
  starRate: number;
  setStarRate: (starRate: number) => void;
};

export default function StarRate({ starRate, setStarRate }: props) {
  const [hover, setHover] = useState(-1);

  return (
    <Box
      sx={{
        width: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Rating
        name="hover-feedback"
        value={starRate}
        precision={0.5}
        size="large"
        onChange={(event, newValue) => {
          if (newValue) {
            setStarRate(newValue);
          }
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        icon={
          <StarIcon
            sx={{
              ml: 0.5,
              mr: 0.5,
            }}
            style={{ color: '#FFC700', width: '2.5rem', height: '2.5rem' }}
            fontSize="inherit"
          />
        }
        emptyIcon={
          <StarIcon
            sx={{
              ml: 0.5,
              mr: 0.5,
            }}
            style={{ opacity: 0.5, color: '#F2F2F280', width: '2.5rem', height: '2.5rem' }}
            fontSize="inherit"
          />
        }
      />
    </Box>
  );
}
