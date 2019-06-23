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
        this.selectedCharacterDetails = {
            mediaLinks: []
        };
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
                description: characters[i].attributes.description,
                media: characters[i].relationships.mediaCharacters.links.related
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

    /**
     * Get Media Link
     *
     * @returns { string } media link
     */
    getMediaLink(charactersId) {
        return this.characters.find(({ id }) => id === charactersId).media;
    }

    /**
     * Set Media Link
     *
     * @param { Array } media links - array of media links
     */
    setMediaLinks(mediaLinks) {
        const mediaLinksArray = [];
        for (let i = 0; i < mediaLinks.length; i++) {
            mediaLinksArray.push(mediaLinks[i].relationships.media.links.related);
        }
        this.selectedCharacterDetails.mediaLinks.push(...mediaLinksArray);
    }

    /**
     * Get Selected Character Details
     *
     * @return { any } selected character details
     */
    getSelectedCharacterDetails() {
        return this.selectedCharacterDetails;
    }
}