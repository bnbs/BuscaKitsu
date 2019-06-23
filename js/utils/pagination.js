/**
 * Pagination Util
 *
 * @author Bruna Silva
 *
 * @since 22/06/2019
 */
class PaginationUtil {

    /**
     * Constructor
     */
    constructor() {}

    /**
     * Get Page List
     *
     * @param { number } totalItems - number of characters
     * @param { number } currentPage - selected page
     * @param { number } pageSize - number of items to show per page
     * @param { number } maxPagesToShow - max pages to show
     *
     * @returns { any } pagination information
     */
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

    /**
     * Total Pages More Than Max Pages
     *
     * @param { number } maxPagesToShow - max pages to show
     * @param { number } currentPage - selected page
     * @param { number } startPage - start page number
     * @param { number } endPage - end page numer
     * @param { number } totalPages - total pages
     *
     * @returns { any } startPage, endPage
     */
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