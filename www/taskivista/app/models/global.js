define([], function() {
    let DATA, DATA_UPDATE_CB, USERS, ME;
    return {
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