define([
    '/taskivista/app/components/user.js',
    '/taskivista/app/components/time_since.js',
    '/taskivista/app/models/state.js',
    '/taskivista/app/utils.js',
], function(
    User,
    TimeSince,
    StateModel,
    utils,
) {
    'use strict';
    const m = window.m;

    const {
        Button,
        Icons,
        Input,
        SelectList,
        ListItem,
        Col,
        Form,
        Icon,
        TagInput,
        Tag,
        TextArea,
        Grid,
        Classes,
        PopoverMenu,
        MenuHeading,
        MenuItem,
        Colors,
      } = window.CUI;

    const GenericActivity = {
        view: (vnode) => {
            let item = vnode.attrs.item;
            return m(".activity", [
                m(Icon, {name: vnode.attrs.icon, intent: vnode.attrs.iconIntent}),
                m(User, {user: item.actor} ),
                m("span.msg", vnode.attrs.msg),
                m("span", vnode.children),
                m(TimeSince, {dt: item.when, class: Classes.TEXT_MUTED}),
            ])
        }
    };
    // 
    // 
    //  ---- ToDo Details Changed
    // 
    // 
    const Create = {
        view: (vnode) => {
            let item = vnode.attrs.item;
            // FIXME: add meeting if linked
            return m(GenericActivity, {
                item, 
                icon: Icons.PLUS,
                msg: "created"
            });
        }
    };

    function changed_message(obj) {
        console.log(obj);
        let changes = [];
        if (obj.title) {
            changes.push(m("span.info", [
                "title ",
                m("stroke", obj.title),
                obj.new_title
            ]))
        }
        if (obj.description) {
            changes.push(m("span.info", {title: obj.description}, "description"))
        }
        if (obj.removed_tags) {
            changes.push(m("span.info", `untagged ${",".join(obj.removed_tags)}` ))
        }
        if (obj.added_tags) {
            changes.push(m("span.info", `tagged ${",".join(obj.added_tags)}` ))
        }
        if (obj.removed_assigned) {
            changes.push(m("span.info", `unassiged` ))
            obj.removed_assigned.forEach(user => {
                changes.push(m(User, {user}))
            });
        }

        if (obj.added_assigned) {
            changes.push(m("span.info", `assiged` ))
            obj.added_assigned.forEach(user => {
                changes.push(m(User, {user}))
            });
        }
        if (obj.dueDate || obj.dueTime) {
            changes.push(m("span.info", `changed due to ${obj.dueDate} ${objDueTime}` ))
        }
        return changes;
    };

    function make_act(icon, msg) {
        return {
            view: (vnode) => {
                let item = vnode.attrs.item;
                return m(GenericActivity, {
                    item, 
                    icon,
                    msg
                }, changed_message(item.object));
            }
        }
    };

    const DetailsChanged = make_act(Icons.EDIT_3, "updated");

    const TitleChanged = make_act(Icons.EDIT_2, "updated");
    const Retagged = make_act(Icons.TAG);
    const Reassign = make_act(Icons.AT_SIGN);
    const ReDue = make_act(Icons.CLOCK);

    // 
    // 
    //  ---- Todo State Changed
    // 
    // 
    const StateChange = {
        view: (vnode) =>  {
            let item = vnode.attrs.item;
            return m(GenericActivity, {
                item, 
                icon: StateModel.get_icon(item.object.to),
                msg: `changed state to ${item.object.to} from ${item.object.from}`
            });
        }
    };

    const Finished = {
        view: (vnode) =>  {
            let item = vnode.attrs.item;
            return m(GenericActivity, {
                item, 
                icon: StateModel.get_icon(item.object.to),
                msg: `marked as ${item.object.to}`,
            })
        }
    };

    const Archive = {
        view: (vnode) =>  {
            let item = vnode.attrs.item;
            return m(GenericActivity, {
                item, 
                icon: StateModel.get_icon(item.object.to),
                iconIntent: "warning",
                msg: `archived as ${item.object.to}`
            });
        }
    };

    const Reopen = {
        view: (vnode) =>  {
            let item = vnode.attrs.item;
            return m(GenericActivity, {
                item, 
                icon: StateModel.get_icon(item.object.to),
                iconIntent: "warning",
                msg: `repened as ${item.object.to}`
            });
        }
    }

    const RENDERERS = {

        "create": Create,
        // Detail updates
        "title_update": TitleChanged,
        "update": DetailsChanged,
        "description_update": DetailsChanged,
        "retagged": Retagged,
        "reassigned": Reassign,
        "due_changed": ReDue,

        // State updates
        "update_state": StateChange,
        "reopen": Reopen,
        "finished": Finished,
        "archive": Archive,
        "done": Finished,
    };

    return {
        view: (vnode) => {
            const {
                item
            } = vnode.attrs;

            let component = RENDERERS[item.verb] || StateChange;

            return m(component, { item });
        }
    }
});