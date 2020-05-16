define([
    '/taskivista/app/models/global.js',
    '/taskivista/app/utils.js',
], function(
    globals,
    utils,
) {
    'use strict';
    const {
        create_activity,
    } = utils;
    const {
        getState
    } = globals
    const m = window.m;

    function add_activity(todo, activity) {
        if (!todo.activities) {
            todo.activities = []
        };
        todo.activities.unshift(activity);
    }

    // function updateTodo (old, next) {
    //     let { ME, DATA, DATA_UPDATE_CB } = getState;
    // }

    function updateState(todo, new_state) {
        if (todo.state === new_state) {
            // nothing to be done;
            return false;
        }
        let { ME, DATA, DATA_UPDATE_CB } = getState();
        let old_state = todo.state;
        todo.state = new_state;
        DATA.todos[todo.id] = todo;

        // FIXME: hard coded.
        let verb = "update_state";
        let toast_msg = {
            message: `${todo.title} state updated`,
            icon: utils.get_state_icon(DATA.SETTINGS.STATES, new_state),
            intent: "primary"
        }
        if (new_state === "done") {
            verb = "finished";
            toast_msg.message = `${todo.title} finished`;
            toast_msg.intent = "primary";
        } else if (new_state === "archived") {
            verb = "archive";
            toast_msg.message = `${todo.title} archived`;
            toast_msg.intent = "warning";
        } else if (old_state === "done" || old_state == "archived") {
            verb = "reopen";
            toast_msg.message = `${todo.title} reopened`;
            toast_msg.intent = "warning";
        };

        add_activity(todo, {
            when: (new Date()).toJSON(),
            actor: {id : ME.uid, name: ME.name },
            verb,
            object: {
                from: old_state,
                to: new_state,
            }
        })
        utils.Toaster.show(toast_msg);
        DATA_UPDATE_CB ? DATA_UPDATE_CB() : "";
        return true
    }

    return {
        updateState,
    }
})
