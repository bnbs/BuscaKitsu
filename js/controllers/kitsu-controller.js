class KitsuController {

    constructor() {
        this.baseUrl = 'https://kitsu.io/api/edge/';
        this.ajax = new XMLHttpRequest();
        this.kitsuModel = new KitsuModel();
    }

    getCharactersList(currentPage, searchText, callback) {
        const instance = this;

        let requestUrl = this.baseUrl + 'characters';
        requestUrl = requestUrl.concat('?page%5Blimit%5D=10');
        requestUrl = requestUrl.concat('&page%5Boffset%5D=' + this.getPageOffset(currentPage));
        requestUrl = requestUrl.concat('&fields%5Bcharacters%5D=name,description,image,mediaCharacters');

        if (searchText || searchText !== '') {
            requestUrl = requestUrl.concat('&filter%5Bname%5D=' + searchText);
        }

        instance.ajax.open("GET", requestUrl, true);
        instance.ajax.send();
        instance.ajax.onreadystatechange = function () {

            if (instance.ajax.readyState === 4 && instance.ajax.status === 200) {
                const response = JSON.parse(instance.ajax.responseText);
                instance.kitsuModel.setCharacters(response.data);
                callback({ characters: instance.getCharacters(), totalItems: response.meta.count});
            } else if (instance.ajax.readyState === 4) {
                callback();
            }
        }
    }

    getPageOffset(currentPage) {
        if (currentPage === 1) return 0;
        else return (currentPage - 1) * 10;
    }

    getCharacters() {
        return this.kitsuModel.getCharacters();
    }
}