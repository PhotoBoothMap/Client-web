import BasicButton from '@components/common/button/BasicButton';
import BasicHeader from '@components/common/header/BasicHeader';
import StarRate from '@components/review/StarRate';
import { tagKey } from '@components/review/Tag';
import TagSelectionBox from '@components/review/TagSelectionBox';
import { deletePhotoApi, registerPhotoApi, registerReviewApi } from '@repositories/booth/review';
import { PreviewPhotoBoxStyle, RegisterPhotoBoxStyle } from '@styles/review/ReviewStyle';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

const reviewTagSelectionKey: ['PICTURE', 'BOOTH', 'FACILITY'] = ['PICTURE', 'BOOTH', 'FACILITY'];

const BoothReviewCreatePage = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [starRate, setStarRate] = useState(0);
  const [userTags, setUserTags] = useState<tagKey[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [content, setContent] = useState('');

  const registerPhoto = useCallback(
    async (e: any) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      const response = await registerPhotoApi(Number(router.query.boothId), formData);

      if (response.success) {
        setPhotos([...photos, response.result.imageUrl]);
      } else {
        alert(response.message);
      }
    },
    [photos, router.query],
  );

  const deletePhoto = useCallback(
    async (photoIndex: number) => {
      const response = await deletePhotoApi(Number(router.query.boothId), photos[photoIndex]);

      if (response.success) {
        const _photos = [...photos];
        _photos.splice(photoIndex, 1);
        setPhotos(_photos);
      } else {
        alert(response.message);
      }
    },
    [photos, router.query],
  );

  const registerReview = useCallback(async () => {
    const requestBody = {
      starRate,
      userTags: userTags.length > 0 ? userTags : null,
      imageUrls: photos.length > 0 ? photos : null,
      content: content !== '' ? content : null,
    };
    const response = await registerReviewApi(Number(router.query.boothId), requestBody);
    if (response.success) {
      alert('리뷰가 등록되었습니다.');
      router.push('/');
    }
  }, [starRate, userTags, content]);

  return (
    <div className={`flex flex-col justify-between w-full h-full text-[#F2F2F2]`}>
      <div className={`flex flex-col justify-start h-1 flex-1`}>
        <BasicHeader
          type={'close'}
          text={'리뷰쓰기'}
          onClickEvent={() => router.push('/sdfwerfwefwefwef e')}
        />

        {page === 1 ? (
          <div className={`flex flex-col h-1 flex-1 overflow-scroll`}>
            <div
              className={`flex flex-col justify-center items-center p-4 gap-4  border-[#2A2A2A] border-b`}
            >
              <div className={`font-semibold`}>{router.query.boothName} 어떠셨나요?</div>
              <StarRate starRate={starRate} setStarRate={setStarRate}></StarRate>
            </div>
            <div className={`flex flex-col`}>
              <div className={`flex flex-col p-4`}>
                <div className={`font-semibold`}>어떤 점이 좋았나요?</div>
                <div className={`font-semibold text-xs`}>(해당하는 태그 1~4개를 선택해주세요)</div>
              </div>
              <div className="flex flex-wrap p-4">
                {reviewTagSelectionKey.map((type) => {
                  return (
                    <div className={`w-1/2 mb-4`} key={type}>
                      <TagSelectionBox
                        type={type}
                        selectedTags={userTags}
                        selectEvent={(tagKey) => {
                          if (userTags.includes(tagKey)) {
                            const _userTags = [...userTags];
                            const index = _userTags.indexOf(tagKey);
                            _userTags.splice(index, 1);
                            setUserTags(_userTags);
                          } else {
                            if (userTags.length === 4) {
                              alert('태그는 최대 4개까지 선택 가능합니다.');
                              return;
                            }
                            setUserTags([...userTags, tagKey]);
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={`flex flex-col p-4 gap-4`}>
              <div className={`font-semibold text-sm`}>사진을 올려주세요</div>
              <div className={`flex gap-4 `}>
                <RegisterPhotoBoxStyle>
                  {photos.length === 3 ? (
                    <div
                      className={`register-photo`}
                      onClick={() => alert('사진은 최대 3장까지 등록 가능합니다.')}
                    ></div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      className="register-photo"
                      onChange={(e) => {
                        registerPhoto(e);
                      }}
                    ></input>
                  )}

                  <div>
                    <Image
                      src={`/common/photo-icon.svg`}
                      width={30}
                      height={30}
                      alt="사진 등록 버튼"
                    />
                  </div>
                  <div className={`font-semibold text-sm`}>{photos.length}/3</div>
                </RegisterPhotoBoxStyle>
                {photos.length > 0 &&
                  photos.map((photoUrl, index) => (
                    <PreviewPhotoBoxStyle photoUrl={photoUrl} key={index}>
                      <div className="delete-button" onClick={() => deletePhoto(index)}>
                        <Image
                          src={`/common/close.svg`}
                          width={15}
                          height={15}
                          alt="사진 삭제 버튼"
                        />
                      </div>
                    </PreviewPhotoBoxStyle>
                  ))}
              </div>
            </div>
            <div className={`p-4`}>
              <textarea
                className={`rounded-md bg-[#2A2A2A] resize-none w-full h-60 p-4`}
                placeholder="더 자세한 의견을 들려주세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
          </>
        )}
      </div>

      <div className={`review-button-box w-full p-4 flex justify-center text-black bg-black`}>
        <BasicButton
          text={page === 1 ? '다음' : '리뷰 등록'}
          color={
            page === 1
              ? starRate > 0 && starRate <= 5 && userTags.length > 0 && userTags.length <= 4
                ? 'darkYellow'
                : 'white'
              : 'darkYellow'
          }
          size={'xLarge'}
          onClickEvent={() => {
            if (page === 1) setPage(2);
            else registerReview();
          }}
        />
      </div>
    </div>
  );
};

export default BoothReviewCreatePage;
