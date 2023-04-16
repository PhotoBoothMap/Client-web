import { HamburgerStyle } from '@styles/common/Hamburger';
import Image from 'next/image';
import React, { useState } from 'react';

const Hamburger = ({}) => {
  const [user, setUser] = useState(null);
  const [openHamburger, setOpenHamburger] = useState(true);

  return (
    <HamburgerStyle display={`${openHamburger ? 'flex' : 'none'}`}>
      <div className="body">
        <div className="user-section">
          <div>{user ? <Image src={``} fill alt={'user img'}></Image> : <div></div>}</div>
          {user ? <div>user name</div> : <button>로그인하기</button>}
        </div>

        <div className="menu-section">
          <div>마이페이지</div>
          <div>공지사항</div>
          <div>설정</div>
        </div>
      </div>
      <div
        onClick={() => {
          setOpenHamburger(false);
        }}
      ></div>
    </HamburgerStyle>
  );
};

export default Hamburger;
