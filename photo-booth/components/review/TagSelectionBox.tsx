import Tag, { tagKey } from './Tag';

type props = {
  type: 'PICTURE' | 'BOOTH' | 'FACILITY';
  selectedTags: tagKey[];
  selectEvent: (tagKey: tagKey) => void;
};

const title = {
  PICTURE: '사진',
  BOOTH: '소품/부스',
  FACILITY: '시설',
};

const tags: { PICTURE: tagKey[]; BOOTH: tagKey[]; FACILITY: tagKey[] } = {
  PICTURE: ['PICTURE', 'LIGHT', 'RETOUCH'],
  BOOTH: ['VARIOUS', 'CLEAN', 'BOOTH'],
  FACILITY: ['FACILITY', 'POWDER_ROOM', 'PARKING'],
};

const TagSelectionBox = ({ type, selectedTags, selectEvent }: props) => {
  return (
    <div className={`flex flex-col gap-2`}>
      <div className={`text-xs font-semibold`}>{title[type]}</div>
      <div className={`flex flex-col gap-2`}>
        {tags[type].map((tag) => {
          return (
            <div onClick={() => selectEvent(tag)}>
              <Tag tagKey={tag} selected={selectedTags.includes(tag)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TagSelectionBox;
