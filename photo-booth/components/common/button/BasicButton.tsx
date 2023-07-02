import {
  BasicButtonStyle,
  SocialLoginButtonStyle,
  buttonColorType,
  buttonSizeype,
} from '@styles/common/ButtonStyle';
import React from 'react';

type buttonProps = {
  text: string;
  color: buttonColorType;
  size: buttonSizeype;
  onClickEvent?: any;
  isActive?: boolean;
};

const BasicButton = ({ size, text, color, onClickEvent, isActive = true }: buttonProps) => {
  return (
    <BasicButtonStyle size={size} color={color} isActive={isActive} onClick={() => onClickEvent()}>
      <div>{text}</div>
    </BasicButtonStyle>
  );
};

export default BasicButton;
