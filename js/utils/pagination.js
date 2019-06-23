class PaginationUtil {

    constructor() {}

    getPageList(totalItems, currentPage, pageSize, maxPagesToShow) {

        let totalPages = Math.ceil(totalItems / pageSize);

        if (currentPage < 1) {
            currentPage = 1;
        }
        else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let startPage, endPage;
        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        }
        else {
            ({ startPage, endPage } = this.totalPagesMoreThanMaxPages(maxPagesToShow, currentPage, startPage, endPage, totalPages));
        }

        return {
            currentPage,
            totalPages,
            startPage,
            endPage
        };
    }

    totalPagesMoreThanMaxPages(maxPagesToShow, currentPage, startPage, endPage, totalPages) {
        let maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
        let maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            startPage = 1;
            endPage = maxPagesToShow;
        }
        else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        }
        else {
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
        return { startPage, endPage };
    }
}