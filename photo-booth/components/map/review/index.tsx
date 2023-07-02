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
        <Image src={LogoBright} alt="" width="44" />
        <div className="meta">
          <Box
            sx={{
              width: 110,
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
                  style={{ color: '#FFC700', width: '1.2rem', height: '1.2rem' }}
                  fontSize="inherit"
                />
              }
              emptyIcon={
                <StarIcon
                  style={{ opacity: 0.5, color: '#F2F2F280', width: '1.2rem', height: '1.2rem' }}
                  fontSize="inherit"
                />
              }
            />
          </Box>
          <p className="date">{'2023.03.26'}</p>
        </div>
        <div className="name_wrapper">
          <p className="name">{name}</p>
        </div>
      </Header>
      <Body>
        <p className="content">{review.content}</p>
        <div className="tag_grid">
          {review.userTags!.map((userTag, idx) => {
            const curKey = tagKeys.filter((key) => {
              return userTag === tags[key];
            })[0];
            return <Tag key={`${userTag}${idx}`} tagKey={curKey} />;
          })}
        </div>
      </Body>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: rgba(26, 26, 26, 0.7);
  padding: 1rem;
  border-radius: 12px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  & {
    img {
      flex: 0 0 auto;
      object-fit: contain;
    }

    div.meta {
      text-align: center;
      p.date {
        font-size: 16px;
        font-weight: 400;
        color: rgba(242, 242, 242, 0.5);
      }
    }

    div.name_wrapper {
      width: 100%;
      text-align: right;
      p.name {
        display: inline;
        font-size: 14px;
        font-weight: 400;
        color: #f2f2f2;
        background-color: #242424;
        padding: 0.5rem 1rem;
        border-radius: 16px;
      }
    }
  }
`;

const Body = styled.div`
  padding-top: 1rem;

  p.content {
    padding: 0.5rem;
    font-size: 16px;
    font-weight: 400;
  }

  div.tag_grid {
    padding-top: 0.5rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-row-gap: 8px;
    grid-column-gap: 8px;
  }
`;
