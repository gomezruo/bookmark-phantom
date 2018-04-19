/**
 * The cookies service for various cookie tasks accross the aplication
 */
export default class ValidationService {

  constructor() {
    this.regex = {
      email: /\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/,
    };
  }

  checkUrl(url) {
    return this.regex.email.test(url);
  }
}
