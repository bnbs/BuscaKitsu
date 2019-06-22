class KitsuModel {

    constructor() {
        this.characters = [];
    }

    setCharacters(characters) {
        this.characters = [];
        for (let i = 0; i < characters.length; i++) {
            this.characters.push({
                id: characters[i].id,
                thumbnail: characters[i].attributes.image.original,
                name: characters[i].attributes.name,
                description: characters[i].attributes.description
            });
        }
    }

    getCharacters() {
        return this.characters;
    }
}