import { useEffect } from 'react';

/**
 * Hook untuk mengubah judul halaman browser (Document Title) secara dinamis.
 * Output: "PerpusDigital - {title}"
 */
const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `PerpusDigital - ${title}`;
  }, [title]);
};

export default usePageTitle;