/**
 * Kitsu View
 *
 * @author Bruna Silva
 *
 * @since 22/06/2019
 */
class KitsuView {

    /**
     * Constructor
     */
    constructor() {
        this.kitsuController = new KitsuController();
        this.paginationUtil = new PaginationUtil();

        this.searchInput = document.getElementById("searchInput");
        this.tableFirstColumn = document.getElementById("firstTableColumn");
        this.tableData = document.getElementById("tableData");
        this.prevPage = document.getElementById("arrowLeft");
        this.nextPage = document.getElementById("arrowRight");
        this.pageList = document.getElementById("pages");
        this.loader = document.getElementById("loader");
        this.noDataMessage = document.getElementById("noDataMessage");

        this.modal = document.querySelector(".modal");
        this.modalHeader = document.querySelector(".modal-header");
        this.modalList = document.getElementById("modalList");
        this.modalLoader = document.getElementById("modalLoader");

        this.pagination = {
            currentPage: 1,
            maxPagesToShow: 6,
            pageSize: 10,
            totalItems: 0
        }
        this.isLoadingPage = true;
        this.searchText = '';

        this.addEventListener();
        this.verifyWindowSize();
        this.getCharactersList();
    }

    /**
     * Add Event Listener to elements
     */
    addEventListener() {
        const instance = this;
        window.addEventListener('resize', () => {
            instance.verifyWindowSize();
        });

        document.getElementById("pages").addEventListener("click", (e) => {
            if (e.target && e.target.matches("div.page-number")) {
                instance.pagination.currentPage = +e.target.innerHTML;
                instance.getCharactersList();
            }
        });

        document.querySelector(".close-button").addEventListener("click", () => {
            document.querySelector('.modal-header h2').remove();
            document.querySelectorAll('.list-item').forEach((item) => {
                item.remove();
            });
            instance.modal.classList.remove('show-modal');
        });

        this.searchInput.addEventListener("keyup", () => {
            instance.searchText = instance.searchInput.value;
            instance.pagination.currentPage = 1;
            instance.getCharactersList();
        });

        this.prevPage.addEventListener('click', () => {
            instance.pagination.currentPage = instance.pagination.currentPage - 1;
            instance.getCharactersList();
        });

        this.nextPage.addEventListener('click', () => {
            instance.pagination.currentPage = instance.pagination.currentPage + 1;
            instance.getCharactersList();
        });

    }

    /**
     * Verify Window Size and update the layout correctly
     */
    verifyWindowSize() {
        const maxPagesToShow = this.pagination.maxPagesToShow;
        if (window.innerWidth <= 700) {
            this.tableFirstColumn.innerHTML = 'Nome';
            this.pagination.maxPagesToShow = 3;
        } else {
            this.tableFirstColumn.innerHTML = 'Personagem';
            this.pagination.maxPagesToShow = 6;
        }

        if (maxPagesToShow !== this.pagination.maxPagesToShow) {
            this.updatePagination(this.pagination.totalItems);
        }
    }

    /**
     * Get Characters List
     */
    getCharactersList() {
        this.startLoading();
        this.removeElementChildren(this.tableData);
        this.kitsuController.getCharactersList(this.pagination.currentPage, this.searchText,
            (response) => {
                this.pagination.totalItems = response.totalItems;
                this.addCharacterList(response.characters);
                this.updatePagination(response.totalItems);
                this.isLoadingPage = false;
                this.stopLoading();
            }
        );
    }

    /**
     * Start Loading
     */
    startLoading() {
        this.loader.style.display = 'flex';
        this.noDataMessage.style.display = 'none';
        if (this.isLoadingPage) {
            this.prevPage.style.display = 'none';
            this.nextPage.style.display = 'none';
        }
    }

    /**
     * Stop Loading
     */
    stopLoading() {
        this.loader.style.display = 'none';
        if (this.pagination.totalItems !== 0) {
            this.prevPage.style.display = 'block';
            this.nextPage.style.display = 'block';
        }
    }

    /**
     * Add Character List
     *
     * @param { Array } characters - characters list
     */
    addCharacterList(characters) {

        if (characters.length === 0) {
            this.noDataMessage.style.display = 'inline-block';
            return;
        }

        this.noDataMessage.style.display = 'none';

        for (let i = 0; i < characters.length; i++) {
            let row = this.tableData.insertRow(i);
            row.classList = ['character'];

            this.addCharacterColumn(row, characters[i]);
            this.addCharacterDescriptionColumn(row, characters[i]);

            row.addEventListener("click", () => {
                this.showCharacterDetails(characters[i].id, characters[i].name);
            });
        }
    }

    showCharacterDetails(characterId, characterName) {
        const instance = this;
        instance.modal.classList.add('show-modal');
        instance.addCharacterTitle(characterName, instance);
        instance.modalLoader.style.display = 'flex'
        this.kitsuController.getCharacterDetails(characterId, (characterDetails) => {
            instance.modalLoader.style.display = 'none';
            if (characterDetails) {
                instance.addCharacterDetails(characterDetails.details, instance);
            }
        });
    }

    addCharacterTitle(characterName, instance) {
        const titleElement = document.createElement('h2');
        const title = document.createTextNode(characterName);
        titleElement.appendChild(title);
        instance.modalHeader.appendChild(titleElement);
    }

    addCharacterDetails(characterDetails, instance) {

        if (!characterDetails || characterDetails.length === 0) {
            const noDataText = document.createElement('h2');
            noDataText.innerText = "Não há mídias para exibir 😢"
            instance.modalList.appendChild(noDataText);
            return;
        }

        for (let i = 0; i < characterDetails.length; i++) {

            const div = document.createElement('div');
            div.classList.add('list-item');

            div.innerHTML = `
                <img src="${characterDetails[i].image}" />
                <div class="details">
                    <div>
                        <h3>${characterDetails[i].title}</h3>
                        ${characterDetails[i].rank ? '<h3>Rank: ' + characterDetails[i].rank + '</h3>' : ''}
                    </div>
                    <h5>${characterDetails[i].synopsis}</h5>
                </div>
            `;

            instance.modalList.appendChild(div);
        }
    }

    /**
     * Add Character Column
     *
     * @param { any } row - row that will contain the character information
     * @param { any } character - character information
     */
    addCharacterColumn(row, character) {
        var characterCell = row.insertCell(0);
        if (character.thumbnail) {
            characterCell.innerHTML = `
                <img src="${character.thumbnail}"/>
            `;
        } else {
            characterCell.innerHTML = `
                <img />
            `;
        }
        characterCell.innerHTML = characterCell.innerHTML + `
            <h3>
                ${character.name}
            </h3>
        `
    }

    /**
     * Add Character Description Column
     *
     * @param { any } row - row that will contain the character information
     * @param { any } character - character information
     */
    addCharacterDescriptionColumn(row, character) {
        var characterCell = row.insertCell(1);
        characterCell.innerHTML = `
            <h3>
                ${character.description ? character.description : 'Não há descrição'}
            </h3>
        `;
    }

    /**
     * Update Pagination
     *
     * @param { number } totalItems - number of characters
     */
    updatePagination(totalItems) {
        let pagination = this.paginationUtil.getPageList(
            totalItems,
            this.pagination.currentPage,
            this.pagination.pageSize,
            this.pagination.maxPagesToShow
        );

        this.removeElementChildren(this.pageList);
        this.addPagination(pagination.startPage, pagination.endPage);

        this.updateArrowStyle(pagination);
    }

    /**
     * Update Arrow Style
     *
     * @param { any } pagination - pagination information
     */
    updateArrowStyle(pagination) {
        if (this.pagination.totalItems === 0) {
            this.prevPage.style.display = 'none';
            this.nextPage.style.display = 'none';
        }

        this.prevPage.classList.remove('disabled');
        this.nextPage.classList.remove('disabled');

        if (this.pagination.currentPage === pagination.startPage) {
            this.prevPage.classList.add('disabled');
        }

        if (this.pagination.currentPage === pagination.totalPages) {
            this.nextPage.classList.add('disabled');
        }
    }

    /**
     * Add Pagination
     *
     * @param { number } startPage - pagination start page
     * @param { number } endPage - pagination end page
     */
    addPagination(startPage, endPage) {
        for (let i = startPage; i <= endPage; i++) {
            let page = document.createElement('div');
            page.classList.add(...['default-flex-center', 'page-number']);
            page.innerHTML = i;

            if (i === this.pagination.currentPage) {
                page.classList.add('active');
            }

            this.pageList.appendChild(page);
        }
    }

    /**
     * Remove Element Children
     *
     * @param { Element } element - DOM Element
     */
    removeElementChildren(element) {
        while (element.hasChildNodes()) {
            element.removeChild(element.firstChild);
        }
    }
}