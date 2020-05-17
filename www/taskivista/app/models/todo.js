define([
    '/taskivista/app/models/global.js',
    '/taskivista/app/utils.js',
], function(
    globals,
    utils,
) {
    'use strict';
    const {
        getState
    } = globals
    const {
        Icons
    } = window.CUI;
    const m = window.m;

    function add_activity(todo, activity) {
        if (!todo.activities) {
            todo.activities = []
        };
        const { ME  } = getState();

        activity.when = (new Date()).toJSON();
        activity.actor = {id : ME.uid, name: ME.name };

        // activites to the top!
        todo.activities.unshift(activity);
    }

    function updateDetails(todo, new_todo) {
        let { DATA, DATA_UPDATE_CB } = getState();
        let change_count = 0;
        let verb = "update";

        const set_verb = (v) => {
            if (v !== verb) {
                change_count += 1;
                verb = v;
            }
        };

        let changes = {};
        if (todo.title !== new_todo.title) {
            changes.title = todo.title;
            changes.new_title = new_todo.title;
            set_verb("title_update");
            todo.title = new_todo.title;
        }

        if (todo.description !== new_todo.description) {
            changes.description =  " ";
            set_verb("description_update");
            todo.description = new_todo.description;
        }

        let new_tags = new_todo.tags.filter((t) => todo.tags.indexOf(t) == -1);
        let removed_tags = todo.tags.filter((t) => new_todo.tags.indexOf(t) == -1);
        todo.tags = new_todo.tags;

        if (removed_tags.length) {
            changes.removed_tags = removed_tags;
            set_verb("retagged");
        }

        if (new_tags.length) {
            changes.new_tags = new_tags;
            set_verb("retagged");
        }

        let new_assigned = new_todo.assigned.filter((t) => todo.assigned.indexOf(t) == -1);
        let removed_assigned = todo.assigned.filter((t) => new_todo.assigned.indexOf(t) == -1);
        todo.assigned = new_todo.assigned;

        if (removed_assigned.length) {
            changes.removed_assigned = removed_assigned;
            set_verb("reassigned");
        }
        
        if (new_assigned.length) {
            changes.new_assigned = new_assigned;
            set_verb("reassigned");
        }

        if (todo.dueDate !== new_todo.dueDate) {
            changes.dueDate = todo.dueDate;
            todo.dueDate = new_todo.dueDate;
            set_verb("due_change");
        }

        if (todo.dueTime !== new_todo.dueTime) {
            changes.dueTime = todo.dueTime;
            todo.dueTime = new_todo.dueTime;
            set_verb("due_change");
        }

        if (change_count === 0) {
            // nothing changes
            return false
        } else if (change_count >= 2) {
            // more than one major change – generic item
            verb = "update";
        }

        add_activity(todo, {
            verb,
            object: changes
        });

        DATA.todos[todo.id] = todo;
        utils.Toaster.show({
            message: `${todo.title} details updated`,
            icon: Icons.SAVE,
            intent: "positive"
        });
        DATA_UPDATE_CB ? DATA_UPDATE_CB() : "";
        return true
    }

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

    function create(item, context) {
        const { DATA, DATA_UPDATE_CB } = getState();
        let todo_id = utils.generate_next_id(DATA.todos);
        item.id = todo_id;
        add_activity(item, {
            verb: "create",
            object: context,
        });
        DATA.todos[item.id] = item;
        DATA_UPDATE_CB ? DATA_UPDATE_CB() : "";

        utils.Toaster.show({
            message: `ToDo added: ${item.title}`,
            icon: Icons.CHECK_SQUARE,
            intent: "positive"
        });
        return item;
    }

    return {
        create,
        updateState,
        updateDetails,
    }
})
