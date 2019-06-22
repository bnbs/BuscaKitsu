class KitsuView {

    constructor() {
        this.kitsuController = new KitsuController();

        this.tableFirstColumn = document.querySelector("thead th:first-child");
        this.tableData = document.querySelector("tbody");

        this.addEventListener();
        this.verifyWindowSize();
        this.getCharactersList();
    }

    addEventListener() {
        const instance = this;
        window.addEventListener('resize', () => {
            instance.verifyWindowSize();
        });
    }

    verifyWindowSize() {
        if (window.innerWidth <= 700) {
            this.tableFirstColumn.innerHTML = 'Nome';
        } else {
            this.tableFirstColumn.innerHTML = 'Personagem';
        }
    }

    getCharactersList() {
        this.kitsuController.getCharactersList((characters) => {
            console.log('Character: ' + characters);
            this.addCharacterList(characters);
        });
    }

    addCharacterList(characters) {
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
        characterCell.innerHTML = `
            <img src="${character.thumbnail}"/>
            <h3>
                ${character.name}
            </h3>
        `;
    }

    addCharacterDescriptionColumn(row, character) {
        var characterCell = row.insertCell(1);
        characterCell.innerHTML = `
            <h3>
                ${character.description}
            </h3>
        `;
    }
}