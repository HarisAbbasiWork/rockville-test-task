// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/categories',
      icon: icons.IconTypography,
      breadcrumbs: false
    },
    {
      id: 'movies',
      title: 'Movies',
      type: 'item',
      url: '/movies',
      icon: icons.IconPalette,
      breadcrumbs: false
    },
  ]
};

export default utilities;
