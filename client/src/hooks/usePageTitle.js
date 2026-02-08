import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `PerpusDigital. - ${title}`;
  }, [title]);
};

export default usePageTitle;