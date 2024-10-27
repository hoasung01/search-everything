interface UsePaginationProps {
    totalCount: number;
    perPage?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
}

interface UsePaginationReturn {
    currentPage: number;
    pageCount: number;
    perPage: number;
    handlePageClick: (selectedItem: { selected: number }) => void;
}

export const usePagination = ({
                                  totalCount,
                                  perPage = 10,
                                  currentPage = 0,
                                  onPageChange
                              }: UsePaginationProps): UsePaginationReturn => {
    const pageCount = Math.ceil(totalCount / perPage);

    const handlePageClick = (selectedItem: { selected: number }) => {
        onPageChange?.(selectedItem.selected);
    };

    return {
        currentPage,
        pageCount,
        perPage,
        handlePageClick
    };
};