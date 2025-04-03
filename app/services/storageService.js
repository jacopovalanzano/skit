// storageService.js ( hardened )
const fs = require('fs');

let storageInstance = null;
const filePath = '/home/pc/Downloads/storage.json';

/**
 * Returns the storage instance
 * @return {Promise<null>}
 */
async function getStorage() {
    if (! storageInstance) {
        // Ensure file exists and is writable
        try {
            if (! fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify({}, null, 2), { flag: 'wx' });
            }
        } catch (err) {
            console.error('File init error:', err);
        }

        storageInstance = {
            filePath: filePath,
            readData: () => {
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    if (! data) return {}; // Handle empty file
                    return JSON.parse(data);
                } catch (err) {
                    console.error('Read error:', err);
                    return {}; // Fallback to empty object
                }
            },
            writeData: (data) => {
                try {
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                } catch (err) {
                    console.error('Write error:', err);
                }
            },
            getItem: (key) => {
                const data = storageInstance.readData();
                return data[key] || null;
            },
            setItem: (key, value) => {
                const data = storageInstance.readData();
                data[key] = value;
                storageInstance.writeData(data);
            },
            removeItem: (key) => {
                const data = storageInstance.readData();
                delete data[key];
                storageInstance.writeData(data);
            }
        };
    }
    return storageInstance;
}

async function read() {
    const storage = await getStorage();
    return storage.readData();
}

async function write(data) {
    const storage = await getStorage();
    return storage.writeData(data);
}

async function unset(key) {
    const storage = await getStorage();
    storage.removeItem(key);
}

async function set(key, value) {
    const storage = await getStorage();
    storage.setItem(key, value);
}

async function get(key) {
    const storage = await getStorage();
    return storage.getItem(key);
}


/* EXPORTS */
module.exports = {
    read,
    write,
    unset,
    set,
    get,
};