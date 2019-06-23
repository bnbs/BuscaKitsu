class KitsuView {

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

    startLoading() {
        this.loader.style.display = 'flex';
        this.noDataMessage.style.display = 'none';
        if (this.isLoadingPage) {
            this.prevPage.style.display = 'none';
            this.nextPage.style.display = 'none';
        }
    }

    stopLoading() {
        this.loader.style.display = 'none';
        if (this.pagination.totalItems !== 0) {
            this.prevPage.style.display = 'block';
            this.nextPage.style.display = 'block';
        }
    }

    addCharacterList(characters) {

        if (characters.length === 0) {
            this.noDataMessage.style.display = 'inline-block';
            return;
        }

        this.noDataMessage.style.display = 'none';

        for (let i = 0; i < characters.length; i++) {
            let row = this.tableData.insertRow(i);
            row.id = characters[i].id;
            row.classList = ['character'];

            this.addCharacterColumn(row, characters[i]);
            this.addCharacterDescriptionColumn(row, characters[i]);
        }
    }

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

    addCharacterDescriptionColumn(row, character) {
        var characterCell = row.insertCell(1);
        characterCell.innerHTML = `
            <h3>
                ${character.description ? character.description : 'Não há descrição'}
            </h3>
        `;
    }

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

    removeElementChildren(element) {
        while (element.hasChildNodes()) {
            element.removeChild(element.firstChild);
        }
    }
}