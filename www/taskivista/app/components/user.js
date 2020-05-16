define([
    '/taskivista/app/models/global.js',
], function(
    global
) {
    'use strict';

    return {
        view: (vnode) => {
            const {
                user
            } = vnode.attrs;
            const {
                USERS
            } = global.getState();

            let user_id = user;
            if (!!user.id) {
                user_id = user.id;
            }

            let details = USERS[user_id];

            return m("span.user", details ? details.name : user.name)
        }
    }
    
});