/**
 * Kitsu Model
 *
 * @author Bruna Silva
 *
 * @since 22/06/2019
 */
class KitsuModel {

    /**
     * Constructor
     */
    constructor() {
        this.characters = [];
    }

    /**
     * Set Characters
     *
     * @param { Array } characters - characters list
     */
    setCharacters(characters) {
        this.characters = [];
        for (let i = 0; i < characters.length; i++) {
            this.characters.push({
                id: characters[i].id,
                thumbnail: characters[i].attributes.image ? characters[i].attributes.image.original : undefined,
                name: characters[i].attributes.name,
                description: characters[i].attributes.description
            });
        }
    }

    /**
     * Get Characters
     *
     * @returns { Array } characters list
     */
    getCharacters() {
        return this.characters;
    }
}