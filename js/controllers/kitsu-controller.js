/**
 * Kitsu Controller
 *
 * @author Bruna Silva
 *
 * @since 22/06/2019
 */
class KitsuController {
  /**
   * Constructor
   */
  constructor() {
    this.baseUrl = "https://kitsu.io/api/edge/";
    this.ajax = new XMLHttpRequest();
    this.kitsuModel = new KitsuModel();
  }

  /**
   * Get Characters List
   *
   * @param { number } currentPage - current selected page
   * @param { string } searchText - search text
   * @param { function } callback - function to be called after getting the request response
   */
  getCharactersList(currentPage, searchText, callback) {
    const instance = this;

    let requestUrl = this.baseUrl + "characters";
    requestUrl = requestUrl.concat("?page%5Blimit%5D=10");
    requestUrl = requestUrl.concat(
      "&page%5Boffset%5D=" + this.getPageOffset(currentPage)
    );
    requestUrl = requestUrl.concat(
      "&fields%5Bcharacters%5D=name,description,image,mediaCharacters"
    );

    if (searchText || searchText !== "") {
      requestUrl = requestUrl.concat("&filter%5Bname%5D=" + searchText);
    }

    instance.ajax.open("GET", requestUrl, true);
    instance.ajax.send();
    instance.ajax.onreadystatechange = function() {
      if (instance.ajax.readyState === 4 && instance.ajax.status === 200) {
        const response = JSON.parse(instance.ajax.responseText);
        instance.kitsuModel.setCharacters(response.data);
        callback({
          characters: instance.getCharacters(),
          totalItems: response.meta.count
        });
      } else if (instance.ajax.readyState === 4) {
        callback();
      }
    };
  }

  /**
   * Get Page Offset
   *
   * @param { number } currentPage - current selected page
   * @returns { number } page offset
   */
  getPageOffset(currentPage) {
    if (currentPage === 1) return 0;
    else return (currentPage - 1) * 10;
  }

  /**
   * Get Characters
   *
   * @returns { Array } characters list
   */
  getCharacters() {
    return this.kitsuModel.getCharacters();
  }

  /**
   * Get Characters Details
   *
   * @param { string } characterId - character id
   * @param { number } currentPage - current selected page
   * @param { function } callback - function to be called after getting the request response
   */
  getCharacterDetails(characterId, currentPage, callback) {
    const instance = this;
    let mediaUrl = this.kitsuModel.getMediaLink(characterId);
    mediaUrl = mediaUrl.concat('?page%5Blimit%5D=10');
    mediaUrl = mediaUrl.concat('&page%5Boffset%5D=' + instance.getPageOffset(currentPage));

    instance.ajax.open("GET", mediaUrl, true);
    instance.ajax.send();
    instance.ajax.onreadystatechange = function() {

      if (instance.ajax.readyState === 4 && instance.ajax.status === 200) {
        const response = JSON.parse(instance.ajax.responseText);

        instance.kitsuModel.setMediaLinks(response.data, currentPage === 1, response.meta.count);
        instance.getCharacterMediaLinks(instance.getPageOffset(currentPage), () => {
            callback(instance.kitsuModel.getSelectedCharacterDetails());
        });
      } else if (instance.ajax.readyState === 4) {
            callback();
      }
    };
  }

  /**
   * Get Characters Media Link
   *
   * @param { number } pos - media position
   * @param { function } callback - function to be called after getting the request response
   */
  getCharacterMediaLinks(pos, callback) {
    const instance = this;
    const mediaLinks = instance.kitsuModel.getSelectedCharacterDetails().mediaLinks;
    const finishedRequests = pos === mediaLinks.length - 1;

    instance.ajax.open("GET", mediaLinks[pos], true);
    instance.ajax.send();

    instance.ajax.onreadystatechange = function() {

        if (instance.ajax.readyState === 4) {

            if (instance.ajax.status === 200) {
                const data = JSON.parse(instance.ajax.responseText).data;
                instance.kitsuModel.setSelectedCharacterDetails(data);
            }

            if (finishedRequests) {
                callback();
            } else {
                instance.getCharacterMediaLinks(pos + 1, callback);
            }
        }
    };
  }
}
