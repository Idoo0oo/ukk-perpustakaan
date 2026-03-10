import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `Sastra.in. - ${title}`;
  }, [title]);
};

export default usePageTitle;