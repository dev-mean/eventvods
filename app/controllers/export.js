var format = require('string-template');
var moment = require('moment');
var EOL = "\r\n";
var NL = EOL + EOL;

function getId(event, sectionIndex, moduleIndex, matchIndex) {
    var str = "",
        counter = 0;
    for (var i = 0; i < sectionIndex; i++) {
        for(var c = 0; c < event.contents[i].modules.length; c++){
            counter += event.contents[i].modules[c].matches2.length;
        }
    }
    for(var c = 0; c < moduleIndex; c++){
        counter += event.contents[sectionIndex].modules[c].matches2.length;
    }
    counter += matchIndex;
    if (counter > 25) {
        str += String.fromCharCode(64 + Math.floor(counter / 26))
        str += String.fromCharCode(65 + (counter % 26));
    } else str = String.fromCharCode(65 + counter);
    return str;
}

function def(v) {
    return typeof v !== "undefined";
}

function has(event, param) {
    return (def(event[param]) && event[param] !== "");
}

function staff_list(staff) {
    return staff.map(function(staff) {
        var twitter = staff.media.filter(media => media.type == "Twitter").length > 0;
        var disp = twitter ? "{forename} \"[**{alias}**]({link})\" {surname}" : "{forename} **\"{alias}\"** {surname}"
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
        link: "https://eventvods.com/event/" + event.slug
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
    var spoiler = invert ? match.spoiler2 : match.spoiler1;
    var text = invert ? match.team2Match : match.team1Match;
    var empty = invert ? !def(match.team2) : !def(match.team1);
    var tag;
    if (!def(match.team1) && !invert) tag = "Team 1";
    else if (!def(match.team2) && invert) tag = "Team 2";
    else tag = invert ? match.team2.tag : match.team1.tag;
    if (!def(text)) text = invert ? "Team 2" : "Team 1";
    return format(disp, {
        team: teamName(tag, spoiler, text, invert),
        icon: (spoiler || empty) ? "" : "[](#" + tag.toLowerCase() + ")"
    })
}

function link(text, link, placeholder, slug) {
    var disp = (def(link) && link != "") ? "[{text}]({link})|" : "{text}|";
    return format(disp, {
        text: text,
        link: placeholder ? "http://"+slug+".eventvods.com" : link
    });
}

function formatExtras(columns, links, slug) {
    var i = 0;
    return columns.map((extra) => {
        return link(extra.replace(/\b\w/g, l => l.toUpperCase()), links[i++], false, slug)
    }).join("");
}

function simple_table(event, section, module, sectionIndex, moduleIndex) {
    var str = "";
    str += format("####{section}, {module}{date}", {
        section: section.title,
        module: module.title,
        date: has(module, "date") ? " - "+moment(module.date).format("dddd, MMMM Do") : ""
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
    module.matches2.forEach((match) => {
        var gameIndex = 0;
        match.data.forEach((game) => {
            var disp = "{id}{index}|{team1}|vs|{team2}|{twitch}{youtube}{extras}";
            str += format(disp, {
                id: getId(event, sectionIndex, moduleIndex, matchIndex),
                index: (match.data.length > 1) ? ++gameIndex : "",
                team1: teamDisplay(match, false),
                team2: teamDisplay(match, true),
                twitch: module.twitch ? link("Twitch", game.twitch.gameStart, game.placeholder, event.game.slug) : "",
                youtube: module.youtube ? link("YouTube", game.youtube.gameStart, game.placeholder, event.game.slug) : "",
                extras: formatExtras(module.columns, game.links, event.game.slug)
            }) + EOL;
        })
        matchIndex++;
    })
    str += NL;
    return str;
}

function table(event, section, module, sectionIndex, moduleIndex) {
    var pbText = (typeof event.game.draftText !== "undefined") ? event.game.draftText : "Picks & Bans";
    var league_only = (event.game.name === "League of Legends") ? "[](http://www.table_title.com \"{section}, {module} \")" : "";
    var str = "";
    str += format("####{section}, {module}{date}", {
        section: section.title,
        module: module.title,
        date: has(module, "date") ? " - "+moment(module.date).format("dddd, MMMM Do") : ""
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
    module.matches2.forEach((match) => {
        var gameIndex = 0;
        match.data.forEach((game) => {
            var disp = (matchIndex === 0 && gameIndex === 0) ? "{id}{index}" + league_only + "|{team1}|vs|{team2}|{twitch}{youtube}{extras}" : "{id}{index}|{team1}|vs|{team2}|{twitch}{youtube}{extras}";
            str += format(disp, {
                id: getId(event, sectionIndex, moduleIndex, matchIndex),
                index: (match.data.length > 1) ? ++gameIndex : "",
                section: section.title,
                module: module.title,
                team1: teamDisplay(match, false),
                team2: teamDisplay(match, true),
                twitch: module.twitch ? link(pbText, game.twitch.picksBans, game.placeholder, event.game.slug) : "",
                youtube: module.youtube ? link(pbText, game.youtube.picksBans, game.placeholder, event.game.slug) + link("Game Start", game.youtube.gameStart, game.placeholder, event.game.slug) : "",
                extras: formatExtras(module.columns, game.links, event.game.slug)
            }) + EOL;
        });
        matchIndex++;
    })
    str += NL;
    return str;
}
module.exports = {
    parse: function(event) {
        var sectionIndex = 0, moduleIndex = 0;
        var md = "<pre>";
        md += infobox(event);
        event.contents.forEach((section) => {
            section.modules.forEach((module) => {
                if (event.game.simple_tables) md += simple_table(event, section, module, sectionIndex, moduleIndex);
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