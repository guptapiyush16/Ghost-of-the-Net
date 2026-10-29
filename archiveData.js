/**
 * Ghost of the Internet - Curated Historical Archive Dataset
 * Hacktoberfest 2026 · Week 4 MVP
 * 
 * 3 Curated Historical Worlds:
 * 1. The Nexus (2003) — Classic early-2000s gaming forum
 * 2. Pixel Witch's Cyber Attic (2003) — Personal GeoCities homepage
 * 3. Starlight Anime Webring (2003) — Early anime fan community & webring
 */

export const archiveWorlds = [
  {
    id: "nexus_gaming",
    name: "The Nexus 2003",
    subtitle: "A forgotten gaming & tech forum",
    category: "Gaming Forum",
    era: "2001 – 2003",
    captureDate: "14 AUG 2003 · 23:04:15 UTC",
    homeUrl: "http://www.nexus-gaming.net/forums/index.html",
    themeColor: "#72372d",
    totalPosts: 1284,
    stats: {
      registeredMembers: 847,
      threadsCount: 219,
      peakMonth: "JUN 2003 (184 posts)",
      lastActivity: "14 AUG 2003 (23:04)",
      fadeStatus: "Signal Lost after OCT 2003"
    },
    timeline: [
      { month: "JAN 03", posts: 142, pct: "75%" },
      { month: "MAR 03", posts: 168, pct: "88%" },
      { month: "JUN 03", posts: 184, pct: "96%" },
      { month: "JUL 03", posts: 112, pct: "60%" },
      { month: "AUG 03", posts: 47, pct: "25%" },
      { month: "SEP 03", posts: 3, pct: "2%" },
      { month: "OCT 03", posts: 0, pct: "0%", note: "Archive connection lost" }
    ],
    pages: [
      {
        id: "index",
        url: "http://www.nexus-gaming.net/forums/index.html",
        title: "The Nexus :: Main Board Index",
        type: "forum_index",
        date: "14 AUG 2003",
        summary: "The main category board of The Nexus online community.",
        sections: [
          {
            category: "General Gaming",
            threads: [
              {
                id: "thread_0047",
                title: "did anyone else hear that on the server?",
                author: "ghost_user_97",
                replies: 12,
                views: 204,
                lastPost: "14 AUG 2003 23:04 by dialup_dan"
              },
              {
                id: "thread_0032",
                title: "Best 56k V.90 modem tweaks for Diablo II Hardcore",
                author: "dialup_dan",
                replies: 28,
                views: 512,
                lastPost: "28 JUL 2003 19:41 by pixel_witch"
              },
              {
                id: "thread_0019",
                title: "Anyone starting college this fall? Forum meetup?",
                author: "shadow_blade",
                replies: 19,
                views: 388,
                lastPost: "04 JUN 2003 14:20 by ghost_user_97"
              }
            ]
          },
          {
            category: "Hardware & Dial-Up",
            threads: [
              {
                id: "thread_hardware",
                title: "Sound Blaster Live! vs Turtle Beach Santa Cruz on Win98",
                author: "voodoo2_guy",
                replies: 15,
                views: 310,
                lastPost: "12 JUL 2003 11:15 by dialup_dan"
              }
            ]
          }
        ]
      },
      {
        id: "thread_0047",
        url: "http://www.nexus-gaming.net/forums/thread_0047.html",
        title: "The Nexus :: Thread #0047 - did anyone else hear that on the server?",
        type: "thread",
        date: "14 AUG 2003",
        summary: "Late night discussion where ghost_user_97 notes their parents are cancelling the internet.",
        posts: [
          {
            id: "post_0047_1",
            author: "ghost_user_97",
            rank: "Junior Member",
            postCount: 12,
            date: "14 AUG 2003 · 22:14:08",
            content: "anyone still here? my parents say they're cancelling the internet next month lol. i keep getting this weird dial-up noise even when nobody is online. probably nothing. anyway, did anyone else hear it?",
            signature: "— ghost_user_97 · “stay connected”",
            ipStatus: "Archived Excerpt · Read-Only"
          },
          {
            id: "post_0047_2",
            author: "pixel_witch",
            rank: "Member",
            postCount: 84,
            date: "14 AUG 2003 · 22:32:49",
            content: "my speakers did that yesterday!! i thought it was just the phone line being weird. are your parents seriously cancelling it? where are you gonna play diablo? maybe we can all meet on the server friday night before school starts?",
            signature: "✦ pixel_witch ✦ check my geocities site in my profile!"
          },
          {
            id: "post_0047_3",
            author: "dialup_dan",
            rank: "Senior Member",
            postCount: 203,
            date: "14 AUG 2003 · 23:01:15",
            content: "server was slow all night. i got kicked twice during the boss run. DO NOT delete the forum before someone saves the walkthrough guides, please. school starts monday for me so my gaming time is gonna drop to zero anyway.",
            signature: "dialup_dan // US Robotics 56k V.90 external modem master"
          },
          {
            id: "post_0047_4",
            author: "ghost_user_97",
            rank: "Junior Member",
            postCount: 13,
            date: "14 AUG 2003 · 23:04:12",
            content: "i'll try to get on from the school library computer next week if they don't block the forum port. thanks for all the games everyone. see you on the other side.",
            signature: "— ghost_user_97 · [last recorded post in collection]"
          }
        ]
      },
      {
        id: "thread_0032",
        url: "http://www.nexus-gaming.net/forums/thread_0032.html",
        title: "The Nexus :: Thread #0032 - Best 56k V.90 modem tweaks for Diablo II",
        type: "thread",
        date: "28 JUL 2003",
        summary: "Detailed discussion on latency optimization, init strings, and dial-up disconnects.",
        posts: [
          {
            id: "post_0032_1",
            author: "dialup_dan",
            rank: "Senior Member",
            postCount: 198,
            date: "28 JUL 2003 · 14:10:00",
            content: "If you're dying in Act IV because your mom picked up the phone extension, add 'AT&F1' and disable call waiting with *70! My ping to USEast dropped from 380ms to 240ms. Anyone else running US Robotics?",
            signature: "dialup_dan // V.90 forever"
          },
          {
            id: "post_0032_2",
            author: "pixel_witch",
            rank: "Member",
            postCount: 79,
            date: "28 JUL 2003 · 19:41:12",
            content: "my brother unplugged the phone cord mid-Baal run and my level 68 sorceress died on hardcore. I literally cried. Never playing without call-waiting disabled again.",
            signature: "✦ pixel_witch ✦ RIP Sorceress Elvira"
          }
        ]
      }
    ],
    passages: [
      {
        id: "nex_01",
        worldId: "nexus_gaming",
        pageId: "thread_0047",
        title: "Thread #0047 - ghost_user_97 final query",
        author: "ghost_user_97",
        date: "14 AUG 2003 · 22:14",
        text: "anyone still here? my parents say they're cancelling the internet next month lol. i keep getting this weird dial-up noise even when nobody is online. probably nothing. anyway, did anyone else hear it?",
        keywords: ["parents", "cancelling", "internet", "dial-up", "noise", "anyone", "hear", "leaving", "offline"]
      },
      {
        id: "nex_02",
        worldId: "nexus_gaming",
        pageId: "thread_0047",
        title: "Thread #0047 - school & forum future",
        author: "dialup_dan",
        date: "14 AUG 2003 · 23:01",
        text: "server was slow all night. i got kicked twice during the boss run. DO NOT delete the forum before someone saves the walkthrough guides, please. school starts monday for me so my gaming time is gonna drop to zero anyway.",
        keywords: ["server", "slow", "school", "monday", "delete", "forum", "guides", "saving", "disappear", "shut"]
      },
      {
        id: "nex_03",
        worldId: "nexus_gaming",
        pageId: "thread_0047",
        title: "Thread #0047 - library computer farewell",
        author: "ghost_user_97",
        date: "14 AUG 2003 · 23:04",
        text: "i'll try to get on from the school library computer next week if they don't block the forum port. thanks for all the games everyone. see you on the other side.",
        keywords: ["library", "school", "computer", "port", "thanks", "games", "goodbye", "farewell", "last", "post"]
      },
      {
        id: "nex_04",
        worldId: "nexus_gaming",
        pageId: "thread_0032",
        title: "Thread #0032 - dialup gaming pains",
        author: "dialup_dan",
        date: "28 JUL 2003 · 14:10",
        text: "If you're dying in Act IV because your mom picked up the phone extension, add 'AT&F1' and disable call waiting with *70! My ping to USEast dropped from 380ms to 240ms.",
        keywords: ["dialup", "phone", "extension", "ping", "modem", "diablo", "lag", "latency"]
      }
    ]
  },

  {
    id: "pixel_witch_attic",
    name: "Pixel Witch's Cyber Attic",
    subtitle: "A personal GeoCities homepage from Area51",
    category: "Personal Homepage",
    era: "2002 – 2003",
    captureDate: "12 OCT 2003 · 18:44:02 UTC",
    homeUrl: "http://www.geocities.com/Area51/Attic/9482/index.html",
    themeColor: "#6f5c8d",
    totalPosts: 38,
    stats: {
      visitorCounter: "004,821",
      guestbookEntries: 19,
      peakMonth: "MAY 2003 (Visitor surge from Diablo webring)",
      lastActivity: "12 OCT 2003 (Guestbook final signature)",
      fadeStatus: "GeoCities Neighborhood Frozen"
    },
    timeline: [
      { month: "FEB 03", posts: 6, pct: "40%" },
      { month: "MAY 03", posts: 14, pct: "95%" },
      { month: "JUL 03", posts: 10, pct: "65%" },
      { month: "AUG 03", posts: 5, pct: "35%" },
      { month: "OCT 03", posts: 1, pct: "8%" },
      { month: "NOV 03", posts: 0, pct: "0%", note: "No further crawls detected" }
    ],
    pages: [
      {
        id: "index",
        url: "http://www.geocities.com/Area51/Attic/9482/index.html",
        title: "★*~ Pixel Witch's Cyber Attic ~*★",
        type: "homepage",
        date: "12 OCT 2003",
        summary: "GeoCities personal homepage featuring under construction banners, blinkies, and gaming shrines.",
        contentHtml: `
          <div class="geocities-banner">
            <span class="blink">★ WELCOME TO MY CORNER OF CYBERSPACE ★</span>
            <p>Best viewed in Netscape Communicator 4.7 or Internet Explorer 5.0 at 800x600 resolution!</p>
          </div>
          <div class="marquee-box"><marquee scrollamount="3">~*~ UPDATE: Oct 2003 - Sorry for no updates, senior year is crazy! Don't forget to sign my guestbook! ~*~</marquee></div>
          <div class="shrine-grid">
            <div class="shrine-card">
              <h3>✦ My Obsessions ✦</h3>
              <ul>
                <li>Diablo II: Lord of Destruction (Level 74 Sorc)</li>
                <li>Sailor Moon & Serial Experiments Lain</li>
                <li>Dreamcast Shenmue and Jet Set Radio</li>
                <li>Making pixel dollz & glitter text</li>
              </ul>
            </div>
            <div class="shrine-card">
              <h3>✦ Web Ring Navigation ✦</h3>
              <p>This site is part of the <strong>Gamer Girls Cyber Ring</strong>!</p>
              <div class="webring-nav">
                <a href="#guestbook" data-virtual-nav="pixel_witch_attic/guestbook.html">[« Previous Site]</a>
                <span>· [Random] ·</span>
                <a href="#shrine" data-virtual-nav="pixel_witch_attic/shrine.html">[Next Site »]</a>
              </div>
            </div>
          </div>
          <div class="visitor-counter">
            <span>VISITORS SINCE NOV 2002:</span>
            <div class="counter-display"><b>0</b><b>0</b><b>4</b><b>8</b><b>2</b><b>1</b></div>
          </div>
        `
      },
      {
        id: "guestbook",
        url: "http://www.geocities.com/Area51/Attic/9482/guestbook.html",
        title: "★*~ Pixel Witch's Guestbook ~*★",
        type: "guestbook",
        date: "12 OCT 2003",
        summary: "Archived guestbook entries containing visitor greetings and the poignant final message.",
        entries: [
          {
            id: "gb_01",
            author: "dialup_dan",
            date: "18 JUL 2003",
            city: "Chicago, IL",
            comment: "cool site! loved the Diablo 2 guide. See you on Battle.net this weekend."
          },
          {
            id: "gb_02",
            author: "neko_chan_99",
            date: "24 AUG 2003",
            city: "Tokyo/Online",
            comment: "kawaii page!! love the animated glitter gifs. Added your banner to my link page!"
          },
          {
            id: "gb_03",
            author: "ghost_user_97",
            date: "14 AUG 2003 · 21:50",
            city: "Somewhere over dial-up",
            comment: "hey pixel_witch, signed your book before things go dark here. great attic you built. stay cool."
          },
          {
            id: "gb_04",
            author: "star_gazer_linda",
            date: "12 OCT 2003 · 18:44",
            city: "Ohio",
            comment: "Hey witch, where did you go? Tried emailing your Hotmail but it bounced. Hope college is going great. Leaving this here just in case you ever check."
          }
        ]
      },
      {
        id: "shrine",
        url: "http://www.geocities.com/Area51/Attic/9482/shrine.html",
        title: "★*~ Sorceress Elvira Shrine & Memorial ~*★",
        type: "shrine",
        date: "28 JUL 2003",
        summary: "A heartfelt tribute to a fallen hardcore Diablo II character.",
        contentHtml: `
          <div class="shrine-container">
            <h2>In Loving Memory: Elvira the Frozen Orb Sorceress</h2>
            <p>Level 68 Hardcore Ladder · Born: March 12, 2003 · Fallen: July 28, 2003</p>
            <blockquote>"Killed by a disconnected telephone line in the Chaos Sanctuary when my brother tried to call his friend."</blockquote>
            <p>Never forget the dangers of shared copper wire phone lines. Rest in peace in the Rogue Encampment.</p>
          </div>
        `
      }
    ],
    passages: [
      {
        id: "witch_01",
        worldId: "pixel_witch_attic",
        pageId: "guestbook",
        title: "Guestbook - Final message from Linda",
        author: "star_gazer_linda",
        date: "12 OCT 2003 · 18:44",
        text: "Hey witch, where did you go? Tried emailing your Hotmail but it bounced. Hope college is going great. Leaving this here just in case you ever check.",
        keywords: ["where", "go", "email", "bounced", "college", "linda", "disappear", "check", "silence", "lost"]
      },
      {
        id: "witch_02",
        worldId: "pixel_witch_attic",
        pageId: "index",
        title: "Homepage Marquee - Senior Year Hiatus",
        author: "pixel_witch",
        date: "12 OCT 2003",
        text: "UPDATE: Oct 2003 - Sorry for no updates, senior year is crazy! Don't forget to sign my guestbook!",
        keywords: ["update", "senior", "year", "school", "crazy", "guestbook", "updates", "hiatus", "inactive"]
      },
      {
        id: "witch_03",
        worldId: "pixel_witch_attic",
        pageId: "guestbook",
        title: "Guestbook - ghost_user_97 pre-disconnect signature",
        author: "ghost_user_97",
        date: "14 AUG 2003 · 21:50",
        text: "hey pixel_witch, signed your book before things go dark here. great attic you built. stay cool.",
        keywords: ["dark", "disconnect", "attic", "signed", "ghost_user_97", "cool", "built"]
      }
    ]
  },

  {
    id: "starlight_anime",
    name: "Starlight Anime Webring",
    subtitle: "An early-2000s episodic fan community",
    category: "Fan Webring",
    era: "2001 – 2003",
    captureDate: "31 DEC 2003 · 23:59:00 UTC",
    homeUrl: "http://starlight.fan-network.org/episodes/index.html",
    themeColor: "#325c80",
    totalPosts: 412,
    stats: {
      registeredMembers: 165,
      fanficsHosted: 44,
      peakMonth: "AUG 2002 (Anime Expo coverage)",
      lastActivity: "31 DEC 2003 (Webmaster shutdown notice)",
      fadeStatus: "Host Domain Expired & Delisted"
    },
    timeline: [
      { month: "JAN 03", posts: 48, pct: "60%" },
      { month: "APR 03", posts: 55, pct: "70%" },
      { month: "JUL 03", posts: 32, pct: "40%" },
      { month: "OCT 03", posts: 14, pct: "18%" },
      { month: "DEC 03", posts: 2, pct: "3%" }
    ],
    pages: [
      {
        id: "index",
        url: "http://starlight.fan-network.org/episodes/index.html",
        title: "Starlight Anime Hub :: Gateway",
        type: "hub",
        date: "31 DEC 2003",
        summary: "The main portal for the Starlight anime community with episodic analysis and fan archives.",
        contentHtml: `
          <div class="anime-header">
            <h1>STARLIGHT ANIME NETWORK</h1>
            <p>Dedicated to thoughtful discussion of Cowboy Bebop, Trigun, Evangelion & Serial Experiments Lain.</p>
          </div>
          <div class="notice-urgent">
            <strong>⚠ NOTICE TO ALL MEMBERS: HOST EXPIRING DEC 31, 2003</strong>
            <p>Our free host 'fan-network.org' is terminating non-commercial subdomains. Please back up your reviews and stories. <a href="#farewell" data-virtual-nav="starlight_anime/farewell.html">Read the Webmaster's Farewell Statement here &raquo;</a></p>
          </div>
          <div class="featured-reviews">
            <h3>Archived Discussions:</h3>
            <div class="review-item">
              <strong>Serial Experiments Lain — Episode 13: "Ego"</strong>
              <p>"No matter where you are, everyone is always connected. Even if the cable is cut, the memory in the wire stays alive."</p>
            </div>
          </div>
        `
      },
      {
        id: "farewell",
        url: "http://starlight.fan-network.org/episodes/farewell.html",
        title: "Starlight Anime Hub :: Final Broadcast",
        type: "farewell",
        date: "31 DEC 2003",
        summary: "The emotional final announcement written by the webmaster before the server shut down.",
        contentHtml: `
          <div class="farewell-card">
            <h2>The Last Broadcast — 31 December 2003</h2>
            <p class="author-tag">Written by: <strong>Kenshin_00</strong> (Webmaster)</p>
            <p>Three years ago this was just a single HTML file on my college account. We grew into a webring of 38 sites and hundreds of late-night episodic debates.</p>
            <p>Hosting fees are going up, and most of the original crew have graduated, started jobs, or migrated over to LiveJournal and AIM chatrooms. I can't afford to keep the server lease renewed on my own.</p>
            <blockquote>"The internet is getting faster, but somehow everyone is moving further apart. Thank you to everyone who ever submitted a review, argued about a soundtrack, or signed our guestbook. Keep looking at the stars."</blockquote>
            <p class="status-offline">— Server shutting down midnight UTC. Archive frozen.</p>
          </div>
        `
      }
    ],
    passages: [
      {
        id: "star_01",
        worldId: "starlight_anime",
        pageId: "farewell",
        title: "Webmaster Farewell - Server Shutdown Reason",
        author: "Kenshin_00",
        date: "31 DEC 2003",
        text: "Hosting fees are going up, and most of the original crew have graduated, started jobs, or migrated over to LiveJournal and AIM chatrooms. I can't afford to keep the server lease renewed on my own. Server shutting down midnight UTC.",
        keywords: ["hosting", "fees", "graduated", "jobs", "livejournal", "aim", "server", "lease", "renewed", "shutting", "down", "reason", "leave", "close"]
      },
      {
        id: "star_02",
        worldId: "starlight_anime",
        pageId: "farewell",
        title: "Webmaster Farewell - Final Reflection",
        author: "Kenshin_00",
        date: "31 DEC 2003",
        text: "The internet is getting faster, but somehow everyone is moving further apart. Thank you to everyone who ever submitted a review, argued about a soundtrack, or signed our guestbook. Keep looking at the stars.",
        keywords: ["faster", "further", "apart", "thank", "you", "stars", "connected", "goodbye", "memory", "closing"]
      },
      {
        id: "star_03",
        worldId: "starlight_anime",
        pageId: "index",
        title: "Lain Discussion - Connection quote",
        author: "Archived Thread",
        date: "15 NOV 2003",
        text: "No matter where you are, everyone is always connected. Even if the cable is cut, the memory in the wire stays alive.",
        keywords: ["connected", "cable", "memory", "wire", "alive", "lain", "philosophy"]
      }
    ]
  }
];

export function getAllPassages() {
  return archiveWorlds.flatMap(world => world.passages);
}

export function getWorldById(worldId) {
  return archiveWorlds.find(w => w.id === worldId) || archiveWorlds[0];
}

export function getPageById(worldId, pageId) {
  const world = getWorldById(worldId);
  return world.pages.find(p => p.id === pageId) || world.pages[0];
}

export function getPassageById(passageId) {
  return getAllPassages().find(p => p.id === passageId);
}
