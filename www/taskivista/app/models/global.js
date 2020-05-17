define([], function() {
    let DATA, DATA_UPDATE_CB, USERS, ME;

    function add_to_latest(name, entry) {
        let updates = DATA.latest[name];
        let idx = updates.indexOf(entry);
        if (idx != -1) {
            updates.splice(idx, 1);
        }
        updates.unshift(entry);
        DATA.latest[name] = updates.slice(0, 10);
    }

    return {
        add_to_latest,
        getState: () => {
            return  {
                DATA, DATA_UPDATE_CB, USERS, ME
            }
        },
        getSettings: () => {
            return DATA.SETTINGS;
        },
        setData: (d) => {
            console.log("setting data", d);
            DATA = d
        },
        setMetadata: (meta, myself) => {
            USERS = Object.values(meta.users);
            ME = myself;
        },
        setDataUpdate: (cb) => {
            DATA_UPDATE_CB = cb;
        }
    }
    
});