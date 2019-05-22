const _alphabet = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
                    'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 
                    's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ]; 

const getRandomLetter = () => {
    const randomIndex = Math.floor(Math.random() * _alphabet.length);
    return _alphabet[randomIndex];
};

const avatarUrl = (dimension) => {
    return `https://api.adorable.io/avatars/${dimension}/${getRandomLetter()}`
};

const injectString = (str, arr) => {
    if (typeof str !== 'string' || !(arr instanceof Array)) {
        return false;
    }

    return str.replace(/({\d})/g, function(i) {
        return arr[i.replace(/{/, '').replace(/}/, '')];
    });
}

module.exports = {
    injectString: injectString,
    avatarUrl: avatarUrl
 };