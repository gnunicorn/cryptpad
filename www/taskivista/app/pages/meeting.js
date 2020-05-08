define([
    '/taskivista/app/components/edit_meeting_details.js',
    '/taskivista/app/utils.js',

], function(
    EditMeetingDetails,
    utils,
) {
    'use strict';
    const m = window.m;
    const {
        Icons,
        Grid,
        Icon,
        Col,
    } = window.CUI;


    function ViewMeeting(vinit) {
        let edit_details = false;
        return {
            view: (vnode) => {
                console.log(vnode.attrs);
                const {
                    id,
                    DATA,
                    USERS,
                    BG_COLOR,
                    onDataUpdate,
                    BORDER,
                } = vnode.attrs;
                const meeting = DATA.meetings[id];

                return m("", { class: "taskivista", style: { "margin-top": "1em" }}, [
                    m("", {
                        style: {
                            "padding": "1em",
                            "background": BG_COLOR,
                            "border": BORDER,
                        }}, [
                            edit_details ? 
                                m(EditMeetingDetails, {
                                    meeting,
                                    USERS,
                                    onsubmit: (item) => {
                                        DATA.meetings[id] = item;
                                        onDataUpdate();
                                        edit_details = false;
                                    },
                                    buttonLabel: "Save"
                                }) : m(Grid, [
                                    m(Col, {span:11}, m("h2", meeting.title)),
                                    m(Col, {span: 1}, m(Icon, {name: Icons.EDIT, onclick:() => (edit_details = true)}))
                                ])
                        ]
                    )
                ]);

            }
        }
    }

    function ScheduleNew(vn) {
        return {
            view: (vnode) => {
                const {
                    USERS,
                    onDataUpdate,
                    BG_COLOR,
                    BORDER,
                    DATA,
                } = vn.attrs;

                return m("", {
                    class: "taskivista",
                    style: {
                        "margin-top": "1em",
                        "padding": "1em",
                        "background": BG_COLOR,
                        "border": BORDER,
                    }}, [
                        m(EditMeetingDetails, {
                            USERS,
                            onsubmit: (item) => {
                                console.log("new item", DATA);
                                if (!DATA.meetings) {
                                     DATA.meetings = {};
                                }
                                let id = item.id = utils.generate_next_id(DATA.meetings);
                                DATA.meetings[id] = item;
                                onDataUpdate();
                                m.route.set('/meeting/:id', { id });
                            },
                            buttonLabel: "Create"
                        })
                    ]
                )
            }
        }
    }

    return {
        ViewMeeting,
        ScheduleNew,
    }
})