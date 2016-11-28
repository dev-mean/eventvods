var format = require('string-template');
var moment = require('moment');
var EOL = "\r\n";
var NL = EOL + EOL;

function getId(event, sectionIndex, moduleIndex, matchIndex) {
    var str = "",
        counter = 0;
    for (var i = 0; i < sectionIndex; i++) {
        counter += event.contents[i].modules.length;
    }
    counter += moduleIndex;
    if (counter > 25) {
        str += String.fromCharCode(64 + Math.floor(counter / 26))
        str += String.fromCharCode(65 + (counter % 26)) + (matchIndex + 1);
    } else str = String.fromCharCode(65 + counter) + (matchIndex + 1);
    return str;
}

function def(v) {
    return typeof v !== "undefined";
}

function has(event, param) {
    return (typeof event[param] !== "undefined");
}

function staff_list(staff) {
    return staff.map(function(staff) {
        var twitter = staff.media.filter(media => media.type == "Twitter").length > 0;
        var disp = twitter ? "{forename} **\"[{alias}]({link})\"** {surname}" : "{forename} **\"{alias}\"** {surname}"
        return format(disp, {
            forename: staff.forename,
            alias: staff.alias,
            link: twitter ? staff.media.filter(media => media.type == "Twitter")[0].link : null,
            surname: staff.surname
        });
    }).join(", ")
}

function team_list(teams) {
    return teams.map(function(team) {
        var wiki = team.media.filter(media => media.type == "Wiki").length > 0;
        var disp = wiki ? "[{full}]({link}) - **{tag}** [](#{icon})" : "{full} - **{tag}** [](#{icon})";
        return format(disp, {
            full: team.name,
            tag: team.tag,
            link: wiki ? team.media.filter(media => media.type == "Wiki")[0].link : null,
            icon: team.tag.toLowerCase()
        });
    }).join("; ");
}

function infobox(event) {
    var str = "",
        hosts = [],
        staff = [];
    str += format("* **[{title}]({link})**", {
        title: event.name,
        link: "https://beta.eventvods.com/event/" + event.slug
    }) + EOL;
    str += format("* **Date:** {start} - {end}", {
        start: moment(event.startDate).format("Do MMMM"),
        end: moment(event.endDate).format("Do MMMM")
    }) + EOL;
    if (has(event, "patch")) str += format("* **Patch:** {patch}", {
        patch: event.patch
    }) + EOL;
    if (has(event, "prize")) str += format("* **Prize Pool:** {prize}", {
        prize: event.prize
    }) + EOL;
    if (has(event, "twitchStream") && has(event, "youtubeStream)")) str += format("* **Streams:** [Twitch.tv]({tw}); [YouTube]({yt});", {
        tw: event.twitchStream,
        yt: event.youtubeStream
    }) + EOL;
    else if (has(event, "twitchStream")) str += format("* **Streams:** [Twitch.tv]({tw})", {
        tw: event.twitchStream
    }) + EOL;
    else if (has(event, "youtubeStream")) str += format("* **Streams:** [YouTube]({tw})", {
        yt: event.youtubeStream
    }) + EOL;
    hosts = event.staff.filter(staff => staff.role == 'Host');
    if (hosts.length > 0) {
        str += format("* **Hosts:** {hostlist}", {
            hostlist: staff_list(hosts)
        }) + EOL;
    }
    staff = event.staff.filter(staff => staff.role != 'Host');
    if (staff.length > 0) {
        str += format("* **On-Air Team:** {stafflist}", {
            stafflist: staff_list(staff)
        }) + EOL;
    }
    if (has(event, "format")) str += format("* **Format:** {format}", {
        format: event.format
    }) + EOL;
    if (event.teams.length > 0) {
        str += format("* **Teams:** {teams}", {
            teams: team_list(event.teams)
        }) + EOL;
    }
    str += NL + "---" + NL;
    str += "> [**If you can read this, you have our stylesheet disabled. If you do not wish to be spoiled, please re-enable our stylesheet, as we have spoiler-specific rules in our stylesheet. Thanks!**](#no_stylesheet)";
    str += NL;
    return str;
}

function teamName(name, spoiler, text, invert) {
    var disp = spoiler ? "[{text}](/s \"{name}\")" : "{name}";
    return format(disp, {
        name: name.replace(/\b\w/g, l => l.toUpperCase()),
        text: text
    });
}

function teamDisplay(match, invert) {
    var disp = invert ? "{icon} **{team}**" : "**{team}** {icon}";
    var spoiler = invert ? match.team2Sp : match.team1Sp;
    var text = invert ? match.team2SpText : match.team1SpText;
    var empty = invert ? !def(match.team2) : !def(match.team1);
    if (!def(match.team1) && !invert) match.team1 = { tag: "Team 1" };
    if (!def(match.team2) && invert) match.team2 = { tag: "Team 2" };
    var tag = invert ? match.team2.tag : match.team1.tag;
    if (!def(text)) text = invert ? "Team 2" : "Team 1";
    return format(disp, {
        team: teamName(tag, spoiler, text, invert),
        icon: (spoiler || empty) ? "" : "[](#" + tag.toLowerCase() + ")"
    })
}

function link(text, link) {
    var disp = (def(link) && link != "") ? "[{text}]({link})|" : "{text}|";
    return format(disp, {
        text: text,
        link: link
    });
}

function formatExtras(columns, links) {
    var i = 0;
    return columns.map((extra) => {
        return link(extra.replace(/\b\w/g, l => l.toUpperCase()), links[i++])
    }).join("");
}

function simple_table(event, section, module, sectionIndex, moduleIndex) {
    var str = "";
    str += format("####{section}, {module}", {
        section: section.title,
        module: module.title
    }) + NL;
    str += format("|#|Team1|vs.|Team2|{twitch}{youtube}{extras}", {
        twitch: module.twitch ? "Twitch|" : "",
        youtube: module.youtube ? "YouTube|" : "",
        extras: module.columns.map((str) => { return str.replace(/\b\w/g, l => l.toUpperCase()) }).join("|")
    }) + EOL;
    str += format(":--:|--:|:--:|:--|{twitch}{youtube}{extras}", {
        twitch: module.twitch ? ":--:|" : "",
        youtube: module.youtube ? ":--:|:--:|" : "",
        extras: module.columns.map(() => { return ":--:" }).join("|")
    }) + EOL;
    var matchIndex = 0;
    module.matches.forEach((match) => {
        var disp = (matchIndex === 0) ? "{id}|{team1}|vs|{team2}|{twitch}{youtube}{extras}" : "{id}|{team1}|vs|{team2}|{twitch}{youtube}{extras}";
        str += format(disp, {
            id: getId(event, sectionIndex, moduleIndex, matchIndex++),
            team1: teamDisplay(match, false),
            team2: teamDisplay(match, true),
            twitch: module.twitch ? link("Twitch", match.twitch.gameStart) : "",
            youtube: module.youtube ? link("YouTube", match.youtube.gameStart) : "",
            extras: formatExtras(module.columns, match.links)
        }) + EOL;
    })
    str += NL;
    return str;
}

function table(event, section, module, sectionIndex, moduleIndex) {
    var pbText = (typeof section.draftText !== "undefined") ? section.draftText : "Picks & Bans";
    var league_only = (event.game.name === "League of Legends") ? "[](http://www.table_title.com \"{section}, {module} \")" : "";
    var str = "";
    str += format("####{section}, {module}", {
        section: section.title,
        module: module.title
    }) + NL;
    str += format("|#|Team1|vs.|Team2|{twitch}{youtube}{extras}", {
        twitch: module.twitch ? "Twitch|" : "",
        youtube: module.youtube ? "YouTube|" : "",
        extras: module.columns.map((str) => { return str.replace(/\b\w/g, l => l.toUpperCase()) }).join("|")
    }) + EOL;
    str += format(":--:|--:|:--:|:--|{twitch}{youtube}{extras}", {
        twitch: module.twitch ? ":--:|" : "",
        youtube: module.youtube ? ":--:|:--:|" : "",
        extras: module.columns.map(() => { return ":--:" }).join("|")
    }) + EOL;
    var matchIndex = 0;
    module.matches.forEach((match) => {
        var disp = (matchIndex === 0) ? "{id}" + league_only + "|{team1}|vs|{team2}|{twitch}{youtube}{extras}" : "{id}|{team1}|vs|{team2}|{twitch}{youtube}{extras}";
        str += format(disp, {
            id: getId(event, sectionIndex, moduleIndex, matchIndex++),
            section: section.title,
            module: module.title,
            team1: teamDisplay(match, false),
            team2: teamDisplay(match, true),
            twitch: module.twitch ? link(pbText, match.twitch.picksBans) : "",
            youtube: module.youtube ? link(pbText, match.youtube.picksBans) + link("Game Start", match.youtube.gameStart) : "",
            extras: formatExtras(module.columns, match.links)
        }) + EOL;
    })
    str += NL;
    return str;
}
module.exports = {
    parse: function(event) {
        var sectionIndex = 0,
            moduleIndex = 0;
        var simple_tables = (event.game.slug === "csgo" || event.game.slug === "overwatch");
        var md = "<pre>";
        md += infobox(event);
        event.contents.forEach((section) => {
            section.modules.forEach((module) => {
                if (simple_tables) md += simple_table(event, section, module, sectionIndex, moduleIndex);
                else md += table(event, section, module, sectionIndex, moduleIndex);
                moduleIndex++;
            })
            sectionIndex++;
            moduleIndex = 0;
        });
        md += "---" + NL;
        md += "**Stay up to date 24/7 - follow us on [Twitter](http://twitter.com/Eventvods), [Facebook](http://www.facebook.com/Eventvods), [YouTube](http://www.youtube.com/loleventvods?sub_confirmation=1). Check out our free apps for [Android](http://play.google.com/store/apps/details?id=com.kox.zzreal) & [iOS](http://appsto.re/us/Eh0m1.i)!**" + EOL;
        md += "</pre>";
        return md;
    }
}