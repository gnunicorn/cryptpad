define([
    '/taskivista/app/pages/dashboard.js',
    '/taskivista/app/pages/meeting.js',
    '/taskivista/app/utils.js',
], function (
    Dashboard,
    Meeting,
    utils,
) {
    const m = window.m;
    const CUI = window.CUI;
    const BG_COLOR = "#fff";
    const BORDER = "solid 1px #c5cdd1";

    let DATA, DATA_UPDATE_CB, USERS, ME;

    const Root = {
        view: (vnode) => {
            let style = {};
            if (DATA && DATA.SETTING && DATA.SETTINGS.background_image) {
                style = {
                    "background": `url(${DATA.SETTINGS.background_image}) center center no-repeat`,
                    "background-size": "cover"
                }
            }
            return m("", { style }, vnode.children)
        }
    }

    function root_for(component) {
        return {
            view: (vnode) => {
                return m(Root, m(component, {
                    BG_COLOR, BORDER, DATA,
                    STATES: DATA.SETTINGS.STATES,
                    USERS, ME, id: vnode.attrs.id,
                    onDataUpdate: () => {
                        DATA_UPDATE_CB ? DATA_UPDATE_CB() : ""
                    }
                }))
            }
        }
    }

    const Routes = {
        "/": root_for(Dashboard),
        "/meeting/:id": root_for(Meeting.ViewMeeting),
        "/new_meeting": root_for(Meeting.ScheduleNew),
    };

    return  {
        setMetadata: (meta, myself) => {
            USERS = Object.values(meta.users);
            ME = myself;
            m.redraw();
        },
        setData: (d) => {
            console.log("setting data", d);
            if (d.version) {
                DATA = d;
            } else {
                DATA = utils.generate_default();
                if(DATA_UPDATE_CB) {
                    DATA_UPDATE_CB();
                }
            }
            m.redraw();
        },
        getData: () => {
            return DATA
        },
        setRoutePrefix: (p) => {
            m.route.prefix = p;
        },
        onDataUpdate: (cb) => {
            DATA_UPDATE_CB = cb;
        },
        setDefaultData: () => {
            DATA = utils.generate_default();
        },
        initAt: (elem) => {
            m.route(elem, "/", Routes);
        }
    }
});