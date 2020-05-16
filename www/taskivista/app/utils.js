define([], function () {
    const Icons = window.CUI.Icons;

    const Toaster = new window.CUI.Toaster();
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    function new_todo(id, title, dueDate) {
        return {
            id,
            title,
            dueDate,
            state: "open",
            assigned: [],
            dueTime: null,
            tags: [],
            activites: []
        }
    }

    function get_state_icon(states, state) {
        for (let s of states) {
            if (s.state == state) {
                return s.icon
            }
        }
        return Icons.TRENDING_UP
    }

    function create_activity(actor, verb, object) {
        return {
            when: (new Date()).toJSON(),
            actor,
            verb,
            object
        }
    }

    const render_users = (user_ids, USERS) => user_ids.map(v => {
        let found = USERS.find(e => e.uid === v);
        return found ? found.name : v
    }).join(", ")

    function new_meeting(id, title, whenDate) {
        return {
            id,
            title,
            whenDate,
            whenTime: null,
            agenda: null,
            participants: [],
            duration: null,
            tags: [],
            outcomes: [],
        }
    }

    function make_into_date(d) {
        `${d.getFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
    }

    function generate_default() {
        // let today = make_into_date(Date.now());
        // let tomorrow = make_into_date(new Date.now() + _MS_PER_DAY);
        return {
            version: 1, // for data migrations
            todos: {
                "1" : new_todo("1", "Check out Taskivista"),
                "2" : new_todo("2", "Make a first Meeting"),
            },
            SETTINGS: {
                background_image: "/taskivista/static/background.webp",
                STATES: [
                    {state: "open", icon: Icons.SQUARE},
                    {state: "progress", icon: Icons.TRENDING_UP},
                    {state: "stalled", icon: Icons.TRENDING_DOWN},
                    {state: "done", icon: Icons.CHECK_SQUARE},
                    {state: "archived", icon: Icons.ARCHIVE}
                ],
            }
        };
    }

    function diff_date(d) {
        const splits = d.split("-").map((x) => parseInt(x, 10));
        const today = new Date();
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
        const utc2 = Date.UTC(splits[0], splits[1] - 1, splits[2]);

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    function formate_day_diff(counts) {
        if (window.Intl && window.Intl.RelativeTimeFormat) {
            return new Intl.RelativeTimeFormat("de", {"numeric": "auto"}).format(counts, "days")
        }
        if (counts == 0) {
            return "Today"
        } else if (counts === 1) {
            return "Tomorrow"
        } else if (counts === -1) {
            return "Yesterday"
        } else if (counts < -1) {
            return `${counts} days ago`
        } else {
            return `in ${counts} days`
        }
    }

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
      }
    function generate_next_id(source) {
        let  uuid;
        do {
            uuid = uuidv4();
        } while (source && source[uuid]);
        return uuid;
    }

    return {
        Toaster,
        uuidv4,
        make_into_date,
        generate_next_id,
        diff_date,
        formate_day_diff,
        new_todo,
        new_meeting,
        generate_default,
        render_users,
        create_activity,
        get_state_icon,
    }
})