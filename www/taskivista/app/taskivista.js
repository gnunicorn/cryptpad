define([
    '/taskivista/app/pages/dashboard.js',
    '/taskivista/app/utils.js',
], function (
    Dashboard,
    utils,
) {
    const m = window.m;
    const CUI = window.CUI;
    const BG_COLOR = "#fff";
    const BORDER = "solid 1px #c5cdd1";

    let DATA, DATA_UPDATE_CB;

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

    const Routes = {
        "/": { view: () => {
                return m(Root, m(Dashboard, {
                    BG_COLOR, BORDER,
                    STATES: DATA.SETTINGS.STATES,
                    todos: DATA.todos,
                    USERS: ["Ben", "Franka", "Milon"],
                    onDataUpdate: () => {
                        DATA_UPDATE_CB ? DATA_UPDATE_CB() : ""
                    }
                }))
            }
        }
    };

    return  {
        setData: (d) => {
            if (d.version) {
                console.log("Data incoming", d);
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