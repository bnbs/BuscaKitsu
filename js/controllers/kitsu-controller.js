class KitsuController {

    constructor() {
        this.baseUrl = 'https://kitsu.io/api/edge/';
        this.ajax = new XMLHttpRequest();
        this.kitsuModel = new KitsuModel();
    }

    getCharactersList(callback) {
        var instance = this;
        instance.ajax.open("GET", `${instance.baseUrl}characters?page%5Blimit%5D=10&page%5Boffset%5D=0`, true);
        instance.ajax.send();
        instance.ajax.onreadystatechange = function () {

            if (instance.ajax.readyState === 4 && instance.ajax.status === 200) {
                const data = JSON.parse(instance.ajax.responseText).data;
                instance.kitsuModel.setCharacters(data);
                callback(instance.getCharacters());
            } else if (instance.ajax.readyState === 4) {
                callback();
            }
        }
    }

    getCharacters() {
        return this.kitsuModel.getCharacters();
    }
}