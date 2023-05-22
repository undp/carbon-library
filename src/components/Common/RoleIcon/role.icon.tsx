import React, { FC } from 'react';

export interface RoleIconProps {
  icon: any;
  bg: string;
  color: string;
}

const RoleIcon: FC<RoleIconProps> = (props: RoleIconProps) => {
  const { icon, bg, color } = props;

  return (
    <span className="role-icon" style={{ backgroundColor: bg, color: color }}>
      {icon}
    </span>
  );
};
export default RoleIcon;
