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

    const StateChange = {
        view: (vnode) =>  {
            let item = vnode.attrs.item;
            return m(".activity", [
                m(Icon, {name: StateModel.get_icon(item.object.to)}),
                m(User, {user: item.actor} ),
                m("span.msg", `changed state to ${item.object.to} from ${item.object.from}`),
                m(TimeSince, {dt: item.when, class: Classes.TEXT_MUTED}),
            ])
        }
    };

    const Finished = {
        view: (vnode) =>  {
            let item = vnode.attrs.item;
            return m(".activity", [
                m(Icon, {name: StateModel.get_icon(item.object.to), intent: "positive"}),
                m(User, {user: item.actor} ),
                m("span.msg", `marked as ${item.object.to}`),
                m(TimeSince, {dt: item.when, class: Classes.TEXT_MUTED}),
            ])
        }
    };

    const Archive = {
        view: (vnode) =>  {
            let item = vnode.attrs.item;
            return m(".activity", [
                m(Icon, {name: StateModel.get_icon(item.object.to), intent: "warning"}),
                m(User, {user: item.actor} ),
                m("span.msg", `archived as ${item.object.to}`),
                m(TimeSince, {dt: item.when, class: Classes.TEXT_MUTED}),
            ])
        }
    };

    const Reopen = {
        view: (vnode) =>  {
            let item = vnode.attrs.item;
            return m(".activity", [
                m(Icon, {name: StateModel.get_icon(item.object.to), intent: "warning"}),
                m(User, {user: item.actor} ),
                m("span.msg", `repened as ${item.object.to}`),
                m(TimeSince, {dt: item.when, class: Classes.TEXT_MUTED}),
            ])
        }
    }

    const RENDERERS = {
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