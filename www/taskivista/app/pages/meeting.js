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
        Tag,
        Col,
        Classes,
    } = window.CUI;


    function ViewMeeting(vinit) {
        let edit_details = false;
        return {
            view: (vnode) => {
                const {
                    id,
                    DATA,
                    USERS,
                    onDataUpdate,
                } = vnode.attrs;
                const meeting = DATA.meetings[id];


                let details = [];
                if (meeting.whenDate) {
                    let dayDiff = utils.diff_date(meeting.whenDate);
                    let formatted = utils.formate_day_diff(dayDiff);
                    if (dayDiff === 0) {
                        details.push(m(`span.${Classes.CUI_CONTROL}.${Classes.POSITIVE}`,[
                            m(Icon, {name: Icons.CLOCK}),
                            m("span", ` ${formatted} ${meeting.whenTime||""}`
                            )
                        ]
                        ));
                    } else if (dayDiff < 0) {
                        details.push(m(`span.${Classes.CUI_CONTROL}.${Classes.WARNING}`,[
                            m(Icon, {name: Icons.ALERT_CIRCLE}),
                            m(`span`,
                                ` ${formatted} ${meeting.whenTime||""}`
                            )
                        ]
                        ));
                    } else if (dayDiff > 0) {
                        details.push(m(`span.${Classes.TEXT_MUTED}`,  
                            `${formatted} ${meeting.whenTime||""}`
                        ));
                    }
                }
                if (Array.isArray(meeting.participants) && meeting.participants.length > 0) {
                    details.push(m("span", [
                        m(Icon, {name: Icons.USERS}),
                        m("span", [utils.render_users(meeting.participants, USERS)]),
                    ]))
                }
                if (Array.isArray(meeting.tags) && meeting.tags.length > 0) {
                    details.push(m("", meeting.tags.map((tag) => 
                        details.push(m(Tag, {label: tag, size: "sm"})))));
                }

                return m("", { class: "taskivista", style: { "margin-top": "1em" }}, [
                    edit_details ? m(".boxed",
                        m(EditMeetingDetails, {
                            meeting,
                            USERS,
                            onsubmit: (item) => {
                                DATA.meetings[id] = item;
                                onDataUpdate();
                                edit_details = false;
                            },
                            buttonLabel: "Save"
                        }))
                    : m(Grid, { class : "boxed" }, [
                            m(Col, {span:11}, [
                                m("h2", meeting.title),
                                m("", details)
                            ]),
                            m(Col, {span: 1, style: { "text-align": "right"}},
                                m(Icon, {name: Icons.EDIT, onclick:() => (edit_details = true)})),
                            m(Col, { span: 12 }, [
                                m("h3", "Agenda"),
                                m("", meeting.agenda), 
                            ])
                        ])
                    ,

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
                    DATA,
                } = vn.attrs;

                return m(".taskivista.boxed", {
                    style: {
                        "margin-top": "1em",
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