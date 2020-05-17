define([
    '/taskivista/app/pages/dashboard.js',
    '/taskivista/app/pages/meeting.js',
    '/taskivista/app/pages/todo.js',
    '/taskivista/app/models/global.js',
    '/taskivista/app/utils.js',
], function (
    Dashboard,
    Meeting,
    Todo,
    global,
    utils,
) {
    const m = window.m;
    const CUI = window.CUI;
    const  {
        getState,
        setMetadata,
        setData,
        setDataUpdate,
    } = global;

    const Root = {
        view: (vnode) => {
            let style = {};
            let { DATA } = getState();
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
                let { DATA, USERS, ME, DATA_UPDATE_CB } = getState();
                return m(Root, m(component, {
                    DATA,
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
        "/todo/:id": root_for(Todo.ViewTodo),
        "/new_meeting": root_for(Meeting.ScheduleNew),
    };

    return  {
        setMetadata: (meta, myself) => {
            setMetadata(meta, myself);
            m.redraw();
        },
        setData: (d) => {
            if (!d.notes) { 
                d.notes = {};
            }
            if (!d.latest) {
                d.latest = {
                    "notes": [],
                    "todos": [],
                    "todo_updates": [],
                    "meetings": [],
                    "activites": [],
                }
            }
            if (d.version) {
                setData(d);
            } else {
                setData(utils.generate_default());
                if(DATA_UPDATE_CB) {
                    DATA_UPDATE_CB();
                }
            }
            m.redraw();
        },
        getData: () => {
            let { DATA } = getState();
            return DATA
        },
        setRoutePrefix: (p) => {
            console.log("Setting prefix:", p);
            m.route.prefix = p;
        },
        onDataUpdate: (cb) => {
            setDataUpdate(cb)
        },
        setDefaultData: () => {
            setData(utils.generate_default());
        },
        initAt: (elem) => {
            m.route(elem, "/", Routes);
        }
    }
});