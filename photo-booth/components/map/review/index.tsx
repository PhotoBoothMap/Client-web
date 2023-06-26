import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

import Tag from '@components/review/Tag';
import LogoBright from '@image/logo_bright.png';
import { Review as RevInterface, tagKey, tags } from '@utils/interface/photoBooth';
import Image from 'next/image';
import styled from 'styled-components';

interface ReviewProps {
  name: string;
  score: number;
  review: Partial<RevInterface>;
}

export default function Review({ name, score, review }: ReviewProps) {
  const tagKeys = Object.keys(tags) as Array<tagKey>;

  return (
    <Wrapper>
      <Header>
        <Image src={LogoBright} alt="" width="30" />
        <div className="meta">
          <Box
            sx={{
              width: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Rating
              name="hover-feedback"
              value={score}
              precision={0.5}
              readOnly={true}
              size="small"
              icon={
                <StarIcon
                  style={{ color: '#FFC700', width: '1rem', height: '1rem' }}
                  fontSize="inherit"
                />
              }
              emptyIcon={
                <StarIcon
                  style={{ opacity: 0.5, color: '#F2F2F280', width: '1rem', height: '1rem' }}
                  fontSize="inherit"
                />
              }
            />
          </Box>
          <p className="date">{review.date?.toString()}</p>
        </div>
        <div className="name_wrapper">
          <p className="name">{name}</p>
        </div>
      </Header>
      <Body>
        <p className="content">{review.content}</p>
        <div className="tag_grid">
          {review.userTags!.map((userTag) => {
            const curKey = tagKeys.filter((key) => {
              return userTag === tags[key];
            })[0];
            return <Tag tagKey={curKey} />;
          })}
        </div>
      </Body>
      <Footer></Footer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: rgba(26, 26, 26, 0.7);
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Body = styled.div`
  p.content {
  }

  div.tag_grid {
  }
`;

const Footer = styled.div``;
