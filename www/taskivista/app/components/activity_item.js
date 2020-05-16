define([
    '/taskivista/app/components/user.js',
    '/taskivista/app/models/state.js',
    '/taskivista/app/utils.js',
], function(
    User,
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

    const StateChange = {
        view: (vnode) =>  {
            let item = vnode.attrs.item;
            return m("", [
                m(Icon, {name: StateModel.get_icon(item.object.to)}),
                m("span", m(User, {user: item.actor} )),
                m("span", `changed state to ${item.object.to} from ${item.object.from}`),
                m("span", item.when),
            ])
        }
    }

    const RENDERERS = {
        "update_state": StateChange,
        "reopen": StateChange,
        "finished": StateChange,
        "archive": StateChange,
        "done": StateChange,
    };

    return {
        view: (vnode) => {
            const {
                item
            } = vnode.attrs;

            return m(StateChange, { item });
        }
    }
});