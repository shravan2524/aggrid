import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SecondaryMenuItemType, setSecondaryMenuItems } from '../state/settings/settingsSlice';
import { useAppDispatch } from '../app/hooks';

type WithSubMenuProps = {
  subMenuItems: SecondaryMenuItemType[]
};
export default function WithSubMenu({ subMenuItems }: WithSubMenuProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setSecondaryMenuItems(subMenuItems));

    return () => {
      dispatch(setSecondaryMenuItems([]));
    };
  }, [subMenuItems, location]);

  return <Outlet />;
}
