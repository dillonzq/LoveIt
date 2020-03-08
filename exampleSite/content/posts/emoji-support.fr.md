---
weight: 5
title: "Emoji Support"
date: 2019-10-01T17:55:28+08:00
lastmod: 2019-10-01T17:55:28+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "Guide d'utilisation des emoji dans Hugo et LoveIt."
license: ""

tags: ["emoji"]
categories: ["markdown"]
hiddenFromHomePage: false

featuredImage: "/images/emoji-support/featured-image.jpg"
featuredImagePreview: ""

toc: true
autoCollapseToc: true
math: false
lightgallery: true
linkToMarkdown: true
share:
  enable: true
comment: true
---

Emoji peut être activé dans un projet Hugo de plusieurs façons.

<!--more-->

{{< admonition warning >}}
Sorry, this article has not been completely translated into **French**.
Welcome to take the time to propose a translation by [making a PR](https://github.com/dillonzq/LoveIt/pulls) to the theme!
{{< /admonition >}}

The [`emojify`](https://gohugo.io/functions/emojify/) function can be called directly in templates or [Inline Shortcodes](https://gohugo.io/templates/shortcode-templates/#inline-shortcodes).

To enable emoji globally, set `enableEmoji` to `true` in your site’s [configuration](https://gohugo.io/getting-started/configuration/) and then you can type emoji shorthand codes directly in content files.

These begin and end with a **colon** and include the **code** of an emoji:

```markdown
Gone camping! {?:}tent: Be back soon.

That is so funny! {?:}joy:
```

The rendered output looks like this:

Gone camping! :tent: Be back soon.

That is so funny! :joy:

## Emoji Cheat Sheet

The emoji cheat sheet is a useful reference for emoji shorthand codes.

### Smileys & Emotion

#### Face Smiling

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:grinning:</span> | `grinning` | <span class="emoji">:smiley:</span> | `smiley` |
| <span class="emoji">:smile:</span> | `smile` | <span class="emoji">:grin:</span> | `grin` |
| <span class="emoji">:laughing:</span> | `laughing` <br /> `satisfied` | <span class="emoji">:sweat_smile:</span> | `sweat_smile` |
| <span class="emoji">:rofl:</span> | `rofl` | <span class="emoji">:joy:</span> | `joy` |
| <span class="emoji">:slightly_smiling_face:</span> | `slightly_smiling_face` | <span class="emoji">:upside_down_face:</span> | `upside_down_face` |
| <span class="emoji">:wink:</span> | `wink` | <span class="emoji">:blush:</span> | `blush` |
| <span class="emoji">:innocent:</span> | `innocent` | | |

#### Face Affection

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:heart_eyes:</span> | `heart_eyes` | <span class="emoji">:kissing_heart:</span> | `kissing_heart` |
| <span class="emoji">:kissing:</span> | `kissing` | <span class="emoji">:relaxed:</span> | `relaxed` |
| <span class="emoji">:kissing_closed_eyes:</span> | `kissing_closed_eyes` | <span class="emoji">:kissing_smiling_eyes:</span> | `kissing_smiling_eyes` |

#### Face Tongue

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:yum:</span> | `yum` | <span class="emoji">:stuck_out_tongue:</span> | `stuck_out_tongue` |
| <span class="emoji">:stuck_out_tongue_winking_eye:</span> | `stuck_out_tongue_winking_eye` | <span class="emoji">:stuck_out_tongue_closed_eyes:</span> | `stuck_out_tongue_closed_eyes` |
| <span class="emoji">:money_mouth_face:</span> | `money_mouth_face` | | |

#### Face Hand

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:hugs:</span> | `hugs` | <span class="emoji">:thinking:</span> | `thinking` |

#### Face Neutral Skeptical

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:zipper_mouth_face:</span> | `zipper_mouth_face` | <span class="emoji">:neutral_face:</span> | `neutral_face` |
| <span class="emoji">:expressionless:</span> | `expressionless` | <span class="emoji">:no_mouth:</span> | `no_mouth` |
| <span class="emoji">:smirk:</span> | `smirk` | <span class="emoji">:unamused:</span> | `unamused` |
| <span class="emoji">:roll_eyes:</span> | `roll_eyes` | <span class="emoji">:grimacing:</span> | `grimacing` |
| <span class="emoji">:lying_face:</span> | `lying_face` | | |

#### Face Sleepy

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:relieved:</span> | `relieved` | <span class="emoji">:pensive:</span> | `pensive` |
| <span class="emoji">:sleepy:</span> | `sleepy` | <span class="emoji">:drooling_face:</span> | `drooling_face` |
| <span class="emoji">:sleeping:</span> | `sleeping` | | |

#### Face Unwell

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:mask:</span> | `mask` | <span class="emoji">:face_with_thermometer:</span> | `face_with_thermometer` |
| <span class="emoji">:face_with_head_bandage:</span> | `face_with_head_bandage` | <span class="emoji">:nauseated_face:</span> | `nauseated_face` |
| <span class="emoji">:sneezing_face:</span> | `sneezing_face` | <span class="emoji">:dizzy_face:</span> | `dizzy_face` |

#### Face Hat

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:cowboy_hat_face:</span> | `cowboy_hat_face` | | |

#### Face Glasses

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:sunglasses:</span> | `sunglasses` | <span class="emoji">:nerd_face:</span> | `nerd_face` |

#### Face Concerned

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:confused:</span> | `confused` | <span class="emoji">:worried:</span> | `worried` |
| <span class="emoji">:slightly_frowning_face:</span> | `slightly_frowning_face` | <span class="emoji">:frowning_face:</span> | `frowning_face` |
| <span class="emoji">:open_mouth:</span> | `open_mouth` | <span class="emoji">:hushed:</span> | `hushed` |
| <span class="emoji">:astonished:</span> | `astonished` | <span class="emoji">:flushed:</span> | `flushed` |
| <span class="emoji">:frowning:</span> | `frowning` | <span class="emoji">:anguished:</span> | `anguished` |
| <span class="emoji">:fearful:</span> | `fearful` | <span class="emoji">:cold_sweat:</span> | `cold_sweat` |
| <span class="emoji">:disappointed_relieved:</span> | `disappointed_relieved` | <span class="emoji">:cry:</span> | `cry` |
| <span class="emoji">:sob:</span> | `sob` | <span class="emoji">:scream:</span> | `scream` |
| <span class="emoji">:confounded:</span> | `confounded` | <span class="emoji">:persevere:</span> | `persevere` |
| <span class="emoji">:disappointed:</span> | `disappointed` | <span class="emoji">:sweat:</span> | `sweat` |
| <span class="emoji">:weary:</span> | `weary` | <span class="emoji">:tired_face:</span> | `tired_face` |

#### Face Negative

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:triumph:</span> | `triumph` | <span class="emoji">:pout:</span> | `pout` <br /> `rage` |
| <span class="emoji">:angry:</span> | `angry` | <span class="emoji">:smiling_imp:</span> | `smiling_imp` |
| <span class="emoji">:imp:</span> | `imp` | <span class="emoji">:skull:</span> | `skull` |
| <span class="emoji">:skull_and_crossbones:</span> | `skull_and_crossbones` | | |

#### Face Costume

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:hankey:</span> | `hankey` <br /> `poop` <br /> `shit` | <span class="emoji">:clown_face:</span> | `clown_face` |
| <span class="emoji">:japanese_ogre:</span> | `japanese_ogre` | <span class="emoji">:japanese_goblin:</span> | `japanese_goblin` |
| <span class="emoji">:ghost:</span> | `ghost` | <span class="emoji">:alien:</span> | `alien` |
| <span class="emoji">:space_invader:</span> | `space_invader` | <span class="emoji">:robot:</span> | `robot` |

#### Cat Face

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:smiley_cat:</span> | `smiley_cat` | <span class="emoji">:smile_cat:</span> | `smile_cat` |
| <span class="emoji">:joy_cat:</span> | `joy_cat` | <span class="emoji">:heart_eyes_cat:</span> | `heart_eyes_cat` |
| <span class="emoji">:smirk_cat:</span> | `smirk_cat` | <span class="emoji">:kissing_cat:</span> | `kissing_cat` |
| <span class="emoji">:scream_cat:</span> | `scream_cat` | <span class="emoji">:crying_cat_face:</span> | `crying_cat_face` |
| <span class="emoji">:pouting_cat:</span> | `pouting_cat` | | |

#### Monkey Face

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:see_no_evil:</span> | `see_no_evil` | <span class="emoji">:hear_no_evil:</span> | `hear_no_evil` |
| <span class="emoji">:speak_no_evil:</span> | `speak_no_evil` | | |

#### Emotion

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:kiss:</span> | `kiss` | <span class="emoji">:love_letter:</span> | `love_letter` |
| <span class="emoji">:cupid:</span> | `cupid` | <span class="emoji">:gift_heart:</span> | `gift_heart` |
| <span class="emoji">:sparkling_heart:</span> | `sparkling_heart` | <span class="emoji">:heartpulse:</span> | `heartpulse` |
| <span class="emoji">:heartbeat:</span> | `heartbeat` | <span class="emoji">:revolving_hearts:</span> | `revolving_hearts` |
| <span class="emoji">:two_hearts:</span> | `two_hearts` | <span class="emoji">:heart_decoration:</span> | `heart_decoration` |
| <span class="emoji">:heavy_heart_exclamation:</span> | `heavy_heart_exclamation` | <span class="emoji">:broken_heart:</span> | `broken_heart` |
| <span class="emoji">:heart:</span> | `heart` | <span class="emoji">:yellow_heart:</span> | `yellow_heart` |
| <span class="emoji">:green_heart:</span> | `green_heart` | <span class="emoji">:blue_heart:</span> | `blue_heart` |
| <span class="emoji">:purple_heart:</span> | `purple_heart` | <span class="emoji">:black_heart:</span> | `black_heart` |
| <span class="emoji">:100:</span> | `100` | <span class="emoji">:anger:</span> | `anger` |
| <span class="emoji">:boom:</span> | `boom` <br /> `collision` | <span class="emoji">:dizzy:</span> | `dizzy` |
| <span class="emoji">:sweat_drops:</span> | `sweat_drops` | <span class="emoji">:dash:</span> | `dash` |
| <span class="emoji">:hole:</span> | `hole` | <span class="emoji">:bomb:</span> | `bomb` |
| <span class="emoji">:speech_balloon:</span> | `speech_balloon` | <span class="emoji">:eye_speech_bubble:</span> | `eye_speech_bubble` |
| <span class="emoji">:right_anger_bubble:</span> | `right_anger_bubble` | <span class="emoji">:thought_balloon:</span> | `thought_balloon` |
| <span class="emoji">:zzz:</span> | `zzz` | | |

### People & Body

#### Hand Fingers Open

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:wave:</span> | `wave` | <span class="emoji">:raised_back_of_hand:</span> | `raised_back_of_hand` |
| <span class="emoji">:raised_hand_with_fingers_splayed:</span> | `raised_hand_with_fingers_splayed` | <span class="emoji">:hand:</span> | `hand` <br /> `raised_hand` |
| <span class="emoji">:vulcan_salute:</span> | `vulcan_salute` | | |

#### Hand Fingers Partial

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:ok_hand:</span> | `ok_hand` | <span class="emoji">:v:</span> | `v` |
| <span class="emoji">:crossed_fingers:</span> | `crossed_fingers` | <span class="emoji">:metal:</span> | `metal` |
| <span class="emoji">:call_me_hand:</span> | `call_me_hand` | | |

#### Hand Single Finger

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:point_left:</span> | `point_left` | <span class="emoji">:point_right:</span> | `point_right` |
| <span class="emoji">:point_up_2:</span> | `point_up_2` | <span class="emoji">:fu:</span> | `fu` <br /> `middle_finger` |
| <span class="emoji">:point_down:</span> | `point_down` | <span class="emoji">:point_up:</span> | `point_up` |

#### Hand Fingers Closed

| icon | code | icon | code |
| :-: | - | :-: | - |
| :+1: | `:+1:` <br /> `thumbsup` | :-1: | `:-1:` <br /> `thumbsdown` |
| <span class="emoji">:fist:</span> | `fist` <br /> `fist_raised` | <span class="emoji">:facepunch:</span> | `facepunch` <br /> `fist_oncoming` <br /> `punch` |
| <span class="emoji">:fist_left:</span> | `fist_left` | <span class="emoji">:fist_right:</span> | `fist_right` |

#### Hands

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:clap:</span> | `clap` | <span class="emoji">:raised_hands:</span> | `raised_hands` |
| <span class="emoji">:open_hands:</span> | `open_hands` | <span class="emoji">:handshake:</span> | `handshake` |
| <span class="emoji">:pray:</span> | `pray` | | |

#### Hand Prop

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:writing_hand:</span> | `writing_hand` | <span class="emoji">:nail_care:</span> | `nail_care` |
| <span class="emoji">:selfie:</span> | `selfie` | | |

#### Body Parts

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:muscle:</span> | `muscle` | <span class="emoji">:ear:</span> | `ear` |
| <span class="emoji">:nose:</span> | `nose` | <span class="emoji">:eyes:</span> | `eyes` |
| <span class="emoji">:eye:</span> | `eye` | <span class="emoji">:tongue:</span> | `tongue` |
| <span class="emoji">:lips:</span> | `lips` | | |

#### Person

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:baby:</span> | `baby` | <span class="emoji">:boy:</span> | `boy` |
| <span class="emoji">:girl:</span> | `girl` | <span class="emoji">:blonde_man:</span> | `blonde_man` <br /> `person_with_blond_hair` |
| <span class="emoji">:man:</span> | `man` | <span class="emoji">:woman:</span> | `woman` |
| <span class="emoji">:blonde_woman:</span> | `blonde_woman` | <span class="emoji">:older_man:</span> | `older_man` |
| <span class="emoji">:older_woman:</span> | `older_woman` | | |

#### Person Gesture

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:frowning_woman:</span> | `frowning_woman` <br /> `person_frowning` | <span class="emoji">:frowning_man:</span> | `frowning_man` |
| <span class="emoji">:person_with_pouting_face:</span> | `person_with_pouting_face` <br /> `pouting_woman` | <span class="emoji">:pouting_man:</span> | `pouting_man` |
| <span class="emoji">:ng_woman:</span> | `ng_woman` <br /> `no_good` <br /> `no_good_woman` | <span class="emoji">:ng_man:</span> | `ng_man` <br /> `no_good_man` |
| <span class="emoji">:ok_woman:</span> | `ok_woman` | <span class="emoji">:ok_man:</span> | `ok_man` |
| <span class="emoji">:information_desk_person:</span> | `information_desk_person` <br /> `sassy_woman` <br /> `tipping_hand_woman` | <span class="emoji">:sassy_man:</span> | `sassy_man` <br /> `tipping_hand_man` |
| <span class="emoji">:raising_hand:</span> | `raising_hand` <br /> `raising_hand_woman` | <span class="emoji">:raising_hand_man:</span> | `raising_hand_man` |
| <span class="emoji">:bow:</span> | `bow` <br /> `bowing_man` | <span class="emoji">:bowing_woman:</span> | `bowing_woman` |
| <span class="emoji">:man_facepalming:</span> | `man_facepalming` | <span class="emoji">:woman_facepalming:</span> | `woman_facepalming` |
| <span class="emoji">:man_shrugging:</span> | `man_shrugging` | <span class="emoji">:woman_shrugging:</span> | `woman_shrugging` |

#### Person Role

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:man_health_worker:</span> | `man_health_worker` | <span class="emoji">:woman_health_worker:</span> | `woman_health_worker` |
| <span class="emoji">:man_student:</span> | `man_student` | <span class="emoji">:woman_student:</span> | `woman_student` |
| <span class="emoji">:man_teacher:</span> | `man_teacher` | <span class="emoji">:woman_teacher:</span> | `woman_teacher` |
| <span class="emoji">:man_judge:</span> | `man_judge` | <span class="emoji">:woman_judge:</span> | `woman_judge` |
| <span class="emoji">:man_farmer:</span> | `man_farmer` | <span class="emoji">:woman_farmer:</span> | `woman_farmer` |
| <span class="emoji">:man_cook:</span> | `man_cook` | <span class="emoji">:woman_cook:</span> | `woman_cook` |
| <span class="emoji">:man_mechanic:</span> | `man_mechanic` | <span class="emoji">:woman_mechanic:</span> | `woman_mechanic` |
| <span class="emoji">:man_factory_worker:</span> | `man_factory_worker` | <span class="emoji">:woman_factory_worker:</span> | `woman_factory_worker` |
| <span class="emoji">:man_office_worker:</span> | `man_office_worker` | <span class="emoji">:woman_office_worker:</span> | `woman_office_worker` |
| <span class="emoji">:man_scientist:</span> | `man_scientist` | <span class="emoji">:woman_scientist:</span> | `woman_scientist` |
| <span class="emoji">:man_technologist:</span> | `man_technologist` | <span class="emoji">:woman_technologist:</span> | `woman_technologist` |
| <span class="emoji">:man_singer:</span> | `man_singer` | <span class="emoji">:woman_singer:</span> | `woman_singer` |
| <span class="emoji">:man_artist:</span> | `man_artist` | <span class="emoji">:woman_artist:</span> | `woman_artist` |
| <span class="emoji">:man_pilot:</span> | `man_pilot` | <span class="emoji">:woman_pilot:</span> | `woman_pilot` |
| <span class="emoji">:man_astronaut:</span> | `man_astronaut` | <span class="emoji">:woman_astronaut:</span> | `woman_astronaut` |
| <span class="emoji">:man_firefighter:</span> | `man_firefighter` | <span class="emoji">:woman_firefighter:</span> | `woman_firefighter` |
| <span class="emoji">:cop:</span> | `cop` <br /> `policeman` | <span class="emoji">:policewoman:</span> | `policewoman` |
| <span class="emoji">:detective:</span> | `detective` <br /> `male_detective` | <span class="emoji">:female_detective:</span> | `female_detective` |
| <span class="emoji">:guardsman:</span> | `guardsman` | <span class="emoji">:guardswoman:</span> | `guardswoman` |
| <span class="emoji">:construction_worker:</span> | `construction_worker` <br /> `construction_worker_man` | <span class="emoji">:construction_worker_woman:</span> | `construction_worker_woman` |
| <span class="emoji">:prince:</span> | `prince` | <span class="emoji">:princess:</span> | `princess` |
| <span class="emoji">:man_with_turban:</span> | `man_with_turban` | <span class="emoji">:woman_with_turban:</span> | `woman_with_turban` |
| <span class="emoji">:man_with_gua_pi_mao:</span> | `man_with_gua_pi_mao` | <span class="emoji">:man_in_tuxedo:</span> | `man_in_tuxedo` |
| <span class="emoji">:bride_with_veil:</span> | `bride_with_veil` | <span class="emoji">:pregnant_woman:</span> | `pregnant_woman` |

#### Person Fantasy

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:angel:</span> | `angel` | <span class="emoji">:santa:</span> | `santa` |
| <span class="emoji">:mrs_claus:</span> | `mrs_claus` | | |

#### Person Activity

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:massage:</span> | `massage` <br /> `massage_woman` | <span class="emoji">:massage_man:</span> | `massage_man` |
| <span class="emoji">:haircut:</span> | `haircut` <br /> `haircut_woman` | <span class="emoji">:haircut_man:</span> | `haircut_man` |
| <span class="emoji">:walking:</span> | `walking` <br /> `walking_man` | <span class="emoji">:walking_woman:</span> | `walking_woman` |
| <span class="emoji">:runner:</span> | `runner` <br /> `running` <br /> `running_man` | <span class="emoji">:running_woman:</span> | `running_woman` |
| <span class="emoji">:dancer:</span> | `dancer` | <span class="emoji">:man_dancing:</span> | `man_dancing` |
| <span class="emoji">:business_suit_levitating:</span> | `business_suit_levitating` | <span class="emoji">:dancers:</span> | `dancers` <br /> `dancing_women` |
| <span class="emoji">:dancing_men:</span> | `dancing_men` | | |

#### Person Sport

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:person_fencing:</span> | `person_fencing` | <span class="emoji">:horse_racing:</span> | `horse_racing` |
| <span class="emoji">:skier:</span> | `skier` | <span class="emoji">:snowboarder:</span> | `snowboarder` |
| <span class="emoji">:golfing_man:</span> | `golfing_man` | <span class="emoji">:golfing_woman:</span> | `golfing_woman` |
| <span class="emoji">:surfer:</span> | `surfer` <br /> `surfing_man` | <span class="emoji">:surfing_woman:</span> | `surfing_woman` |
| <span class="emoji">:rowboat:</span> | `rowboat` <br /> `rowing_man` | <span class="emoji">:rowing_woman:</span> | `rowing_woman` |
| <span class="emoji">:swimmer:</span> | `swimmer` <br /> `swimming_man` | <span class="emoji">:swimming_woman:</span> | `swimming_woman` |
| <span class="emoji">:basketball_man:</span> | `basketball_man` | <span class="emoji">:basketball_woman:</span> | `basketball_woman` |
| <span class="emoji">:weight_lifting_man:</span> | `weight_lifting_man` | <span class="emoji">:weight_lifting_woman:</span> | `weight_lifting_woman` |
| <span class="emoji">:bicyclist:</span> | `bicyclist` <br /> `biking_man` | <span class="emoji">:biking_woman:</span> | `biking_woman` |
| <span class="emoji">:mountain_bicyclist:</span> | `mountain_bicyclist` <br /> `mountain_biking_man` | <span class="emoji">:mountain_biking_woman:</span> | `mountain_biking_woman` |
| <span class="emoji">:man_cartwheeling:</span> | `man_cartwheeling` | <span class="emoji">:woman_cartwheeling:</span> | `woman_cartwheeling` |
| <span class="emoji">:men_wrestling:</span> | `men_wrestling` | <span class="emoji">:women_wrestling:</span> | `women_wrestling` |
| <span class="emoji">:man_playing_water_polo:</span> | `man_playing_water_polo` | <span class="emoji">:woman_playing_water_polo:</span> | `woman_playing_water_polo` |
| <span class="emoji">:man_playing_handball:</span> | `man_playing_handball` | <span class="emoji">:woman_playing_handball:</span> | `woman_playing_handball` |
| <span class="emoji">:man_juggling:</span> | `man_juggling` | <span class="emoji">:woman_juggling:</span> | `woman_juggling` |

#### Person Resting

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:bath:</span> | `bath` | <span class="emoji">:sleeping_bed:</span> | `sleeping_bed` |

#### Family

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:two_women_holding_hands:</span> | `two_women_holding_hands` | <span class="emoji">:couple:</span> | `couple` |
| <span class="emoji">:two_men_holding_hands:</span> | `two_men_holding_hands` | <span class="emoji">:couplekiss_man_woman:</span> | `couplekiss_man_woman` |
| <span class="emoji">:couplekiss_man_man:</span> | `couplekiss_man_man` | <span class="emoji">:couplekiss_woman_woman:</span> | `couplekiss_woman_woman` |
| <span class="emoji">:couple_with_heart:</span> | `couple_with_heart` <br /> `couple_with_heart_woman_man` | <span class="emoji">:couple_with_heart_man_man:</span> | `couple_with_heart_man_man` |
| <span class="emoji">:couple_with_heart_woman_woman:</span> | `couple_with_heart_woman_woman` | <span class="emoji">:family:</span> | `family` <br /> `family_man_woman_boy` |
| <span class="emoji">:family_man_woman_girl:</span> | `family_man_woman_girl` | <span class="emoji">:family_man_woman_girl_boy:</span> | `family_man_woman_girl_boy` |
| <span class="emoji">:family_man_woman_boy_boy:</span> | `family_man_woman_boy_boy` | <span class="emoji">:family_man_woman_girl_girl:</span> | `family_man_woman_girl_girl` |
| <span class="emoji">:family_man_man_boy:</span> | `family_man_man_boy` | <span class="emoji">:family_man_man_girl:</span> | `family_man_man_girl` |
| <span class="emoji">:family_man_man_girl_boy:</span> | `family_man_man_girl_boy` | <span class="emoji">:family_man_man_boy_boy:</span> | `family_man_man_boy_boy` |
| <span class="emoji">:family_man_man_girl_girl:</span> | `family_man_man_girl_girl` | <span class="emoji">:family_woman_woman_boy:</span> | `family_woman_woman_boy` |
| <span class="emoji">:family_woman_woman_girl:</span> | `family_woman_woman_girl` | <span class="emoji">:family_woman_woman_girl_boy:</span> | `family_woman_woman_girl_boy` |
| <span class="emoji">:family_woman_woman_boy_boy:</span> | `family_woman_woman_boy_boy` | <span class="emoji">:family_woman_woman_girl_girl:</span> | `family_woman_woman_girl_girl` |
| <span class="emoji">:family_man_boy:</span> | `family_man_boy` | <span class="emoji">:family_man_boy_boy:</span> | `family_man_boy_boy` |
| <span class="emoji">:family_man_girl:</span> | `family_man_girl` | <span class="emoji">:family_man_girl_boy:</span> | `family_man_girl_boy` |
| <span class="emoji">:family_man_girl_girl:</span> | `family_man_girl_girl` | <span class="emoji">:family_woman_boy:</span> | `family_woman_boy` |
| <span class="emoji">:family_woman_boy_boy:</span> | `family_woman_boy_boy` | <span class="emoji">:family_woman_girl:</span> | `family_woman_girl` |
| <span class="emoji">:family_woman_girl_boy:</span> | `family_woman_girl_boy` | <span class="emoji">:family_woman_girl_girl:</span> | `family_woman_girl_girl` |

#### Person Symbol

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:speaking_head:</span> | `speaking_head` | <span class="emoji">:bust_in_silhouette:</span> | `bust_in_silhouette` |
| <span class="emoji">:busts_in_silhouette:</span> | `busts_in_silhouette` | <span class="emoji">:footprints:</span> | `footprints` |

### Animals & Nature

#### Animal Mammal

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:monkey_face:</span> | `monkey_face` | <span class="emoji">:monkey:</span> | `monkey` |
| <span class="emoji">:gorilla:</span> | `gorilla` | <span class="emoji">:dog:</span> | `dog` |
| <span class="emoji">:dog2:</span> | `dog2` | <span class="emoji">:poodle:</span> | `poodle` |
| <span class="emoji">:wolf:</span> | `wolf` | <span class="emoji">:fox_face:</span> | `fox_face` |
| <span class="emoji">:cat:</span> | `cat` | <span class="emoji">:cat2:</span> | `cat2` |
| <span class="emoji">:lion:</span> | `lion` | <span class="emoji">:tiger:</span> | `tiger` |
| <span class="emoji">:tiger2:</span> | `tiger2` | <span class="emoji">:leopard:</span> | `leopard` |
| <span class="emoji">:horse:</span> | `horse` | <span class="emoji">:racehorse:</span> | `racehorse` |
| <span class="emoji">:unicorn:</span> | `unicorn` | <span class="emoji">:deer:</span> | `deer` |
| <span class="emoji">:cow:</span> | `cow` | <span class="emoji">:ox:</span> | `ox` |
| <span class="emoji">:water_buffalo:</span> | `water_buffalo` | <span class="emoji">:cow2:</span> | `cow2` |
| <span class="emoji">:pig:</span> | `pig` | <span class="emoji">:pig2:</span> | `pig2` |
| <span class="emoji">:boar:</span> | `boar` | <span class="emoji">:pig_nose:</span> | `pig_nose` |
| <span class="emoji">:ram:</span> | `ram` | <span class="emoji">:sheep:</span> | `sheep` |
| <span class="emoji">:goat:</span> | `goat` | <span class="emoji">:dromedary_camel:</span> | `dromedary_camel` |
| <span class="emoji">:camel:</span> | `camel` | <span class="emoji">:elephant:</span> | `elephant` |
| <span class="emoji">:rhinoceros:</span> | `rhinoceros` | <span class="emoji">:mouse:</span> | `mouse` |
| <span class="emoji">:mouse2:</span> | `mouse2` | <span class="emoji">:rat:</span> | `rat` |
| <span class="emoji">:hamster:</span> | `hamster` | <span class="emoji">:rabbit:</span> | `rabbit` |
| <span class="emoji">:rabbit2:</span> | `rabbit2` | <span class="emoji">:chipmunk:</span> | `chipmunk` |
| <span class="emoji">:bat:</span> | `bat` | <span class="emoji">:bear:</span> | `bear` |
| <span class="emoji">:koala:</span> | `koala` | <span class="emoji">:panda_face:</span> | `panda_face` |
| <span class="emoji">:feet:</span> | `feet` <br /> `paw_prints` | | |

#### Animal Bird

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:turkey:</span> | `turkey` | <span class="emoji">:chicken:</span> | `chicken` |
| <span class="emoji">:rooster:</span> | `rooster` | <span class="emoji">:hatching_chick:</span> | `hatching_chick` |
| <span class="emoji">:baby_chick:</span> | `baby_chick` | <span class="emoji">:hatched_chick:</span> | `hatched_chick` |
| <span class="emoji">:bird:</span> | `bird` | <span class="emoji">:penguin:</span> | `penguin` |
| <span class="emoji">:dove:</span> | `dove` | <span class="emoji">:eagle:</span> | `eagle` |
| <span class="emoji">:duck:</span> | `duck` | <span class="emoji">:owl:</span> | `owl` |

#### Animal Amphibian

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:frog:</span> | `frog` |

#### Animal Reptile

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:crocodile:</span> | `crocodile` | <span class="emoji">:turtle:</span> | `turtle` |
| <span class="emoji">:lizard:</span> | `lizard` | <span class="emoji">:snake:</span> | `snake` |
| <span class="emoji">:dragon_face:</span> | `dragon_face` | <span class="emoji">:dragon:</span> | `dragon` |

#### Animal Marine

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:whale:</span> | `whale` | <span class="emoji">:whale2:</span> | `whale2` |
| <span class="emoji">:dolphin:</span> | `dolphin` <br /> `flipper` | <span class="emoji">:fish:</span> | `fish` |
| <span class="emoji">:tropical_fish:</span> | `tropical_fish` | <span class="emoji">:blowfish:</span> | `blowfish` |
| <span class="emoji">:shark:</span> | `shark` | <span class="emoji">:octopus:</span> | `octopus` |
| <span class="emoji">:shell:</span> | `shell` | | |

#### Animal Bug

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:snail:</span> | `snail` | <span class="emoji">:butterfly:</span> | `butterfly` |
| <span class="emoji">:bug:</span> | `bug` | <span class="emoji">:ant:</span> | `ant` |
| <span class="emoji">:bee:</span> | `bee` <br /> `honeybee` | <span class="emoji">:beetle:</span> | `beetle` |
| <span class="emoji">:spider:</span> | `spider` | <span class="emoji">:spider_web:</span> | `spider_web` |
| <span class="emoji">:scorpion:</span> | `scorpion` | | |

#### Plant Flower

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:bouquet:</span> | `bouquet` | <span class="emoji">:cherry_blossom:</span> | `cherry_blossom` |
| <span class="emoji">:white_flower:</span> | `white_flower` | <span class="emoji">:rosette:</span> | `rosette` |
| <span class="emoji">:rose:</span> | `rose` | <span class="emoji">:wilted_flower:</span> | `wilted_flower` |
| <span class="emoji">:hibiscus:</span> | `hibiscus` | <span class="emoji">:sunflower:</span> | `sunflower` |
| <span class="emoji">:blossom:</span> | `blossom` | <span class="emoji">:tulip:</span> | `tulip` |

#### Plant Other

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:seedling:</span> | `seedling` | <span class="emoji">:evergreen_tree:</span> | `evergreen_tree` |
| <span class="emoji">:deciduous_tree:</span> | `deciduous_tree` | <span class="emoji">:palm_tree:</span> | `palm_tree` |
| <span class="emoji">:cactus:</span> | `cactus` | <span class="emoji">:ear_of_rice:</span> | `ear_of_rice` |
| <span class="emoji">:herb:</span> | `herb` | <span class="emoji">:shamrock:</span> | `shamrock` |
| <span class="emoji">:four_leaf_clover:</span> | `four_leaf_clover` | <span class="emoji">:maple_leaf:</span> | `maple_leaf` |
| <span class="emoji">:fallen_leaf:</span> | `fallen_leaf` | <span class="emoji">:leaves:</span> | `leaves` |

### Food & Drink

#### Food Fruit

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:grapes:</span> | `grapes` | <span class="emoji">:melon:</span> | `melon` |
| <span class="emoji">:watermelon:</span> | `watermelon` | <span class="emoji">:mandarin:</span> | `mandarin` <br /> `orange` <br /> `tangerine` |
| <span class="emoji">:lemon:</span> | `lemon` | <span class="emoji">:banana:</span> | `banana` |
| <span class="emoji">:pineapple:</span> | `pineapple` | <span class="emoji">:apple:</span> | `apple` |
| <span class="emoji">:green_apple:</span> | `green_apple` | <span class="emoji">:pear:</span> | `pear` |
| <span class="emoji">:peach:</span> | `peach` | <span class="emoji">:cherries:</span> | `cherries` |
| <span class="emoji">:strawberry:</span> | `strawberry` | <span class="emoji">:kiwi_fruit:</span> | `kiwi_fruit` |
| <span class="emoji">:tomato:</span> | `tomato` | | |

#### Food Vegetable

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:avocado:</span> | `avocado` | <span class="emoji">:eggplant:</span> | `eggplant` |
| <span class="emoji">:potato:</span> | `potato` | <span class="emoji">:carrot:</span> | `carrot` |
| <span class="emoji">:corn:</span> | `corn` | <span class="emoji">:hot_pepper:</span> | `hot_pepper` |
| <span class="emoji">:cucumber:</span> | `cucumber` | <span class="emoji">:mushroom:</span> | `mushroom` |
| <span class="emoji">:peanuts:</span> | `peanuts` | <span class="emoji">:chestnut:</span> | `chestnut` |

#### Food Prepared

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:bread:</span> | `bread` | <span class="emoji">:croissant:</span> | `croissant` |
| <span class="emoji">:baguette_bread:</span> | `baguette_bread` | <span class="emoji">:pancakes:</span> | `pancakes` |
| <span class="emoji">:cheese:</span> | `cheese` | <span class="emoji">:meat_on_bone:</span> | `meat_on_bone` |
| <span class="emoji">:poultry_leg:</span> | `poultry_leg` | <span class="emoji">:bacon:</span> | `bacon` |
| <span class="emoji">:hamburger:</span> | `hamburger` | <span class="emoji">:fries:</span> | `fries` |
| <span class="emoji">:pizza:</span> | `pizza` | <span class="emoji">:hotdog:</span> | `hotdog` |
| <span class="emoji">:taco:</span> | `taco` | <span class="emoji">:burrito:</span> | `burrito` |
| <span class="emoji">:stuffed_flatbread:</span> | `stuffed_flatbread` | <span class="emoji">:egg:</span> | `egg` |
| <span class="emoji">:fried_egg:</span> | `fried_egg` | <span class="emoji">:shallow_pan_of_food:</span> | `shallow_pan_of_food` |
| <span class="emoji">:stew:</span> | `stew` | <span class="emoji">:green_salad:</span> | `green_salad` |
| <span class="emoji">:popcorn:</span> | `popcorn` | | |

#### Food Asian

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:bento:</span> | `bento` | <span class="emoji">:rice_cracker:</span> | `rice_cracker` |
| <span class="emoji">:rice_ball:</span> | `rice_ball` | <span class="emoji">:rice:</span> | `rice` |
| <span class="emoji">:curry:</span> | `curry` | <span class="emoji">:ramen:</span> | `ramen` |
| <span class="emoji">:spaghetti:</span> | `spaghetti` | <span class="emoji">:sweet_potato:</span> | `sweet_potato` |
| <span class="emoji">:oden:</span> | `oden` | <span class="emoji">:sushi:</span> | `sushi` |
| <span class="emoji">:fried_shrimp:</span> | `fried_shrimp` | <span class="emoji">:fish_cake:</span> | `fish_cake` |
| <span class="emoji">:dango:</span> | `dango` | | |

#### Food Marine

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:crab:</span> | `crab` | <span class="emoji">:shrimp:</span> | `shrimp` |
| <span class="emoji">:squid:</span> | `squid` | | |

#### Food Sweet

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:icecream:</span> | `icecream` | <span class="emoji">:shaved_ice:</span> | `shaved_ice` |
| <span class="emoji">:ice_cream:</span> | `ice_cream` | <span class="emoji">:doughnut:</span> | `doughnut` |
| <span class="emoji">:cookie:</span> | `cookie` | <span class="emoji">:birthday:</span> | `birthday` |
| <span class="emoji">:cake:</span> | `cake` | <span class="emoji">:chocolate_bar:</span> | `chocolate_bar` |
| <span class="emoji">:candy:</span> | `candy` | <span class="emoji">:lollipop:</span> | `lollipop` |
| <span class="emoji">:custard:</span> | `custard` | <span class="emoji">:honey_pot:</span> | `honey_pot` |

#### Drink

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:baby_bottle:</span> | `baby_bottle` | <span class="emoji">:milk_glass:</span> | `milk_glass` |
| <span class="emoji">:coffee:</span> | `coffee` | <span class="emoji">:tea:</span> | `tea` |
| <span class="emoji">:sake:</span> | `sake` | <span class="emoji">:champagne:</span> | `champagne` |
| <span class="emoji">:wine_glass:</span> | `wine_glass` | <span class="emoji">:cocktail:</span> | `cocktail` |
| <span class="emoji">:tropical_drink:</span> | `tropical_drink` | <span class="emoji">:beer:</span> | `beer` |
| <span class="emoji">:beers:</span> | `beers` | <span class="emoji">:clinking_glasses:</span> | `clinking_glasses` |
| <span class="emoji">:tumbler_glass:</span> | `tumbler_glass` | | |

#### Dishware

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:plate_with_cutlery:</span> | `plate_with_cutlery` | <span class="emoji">:fork_and_knife:</span> | `fork_and_knife` |
| <span class="emoji">:spoon:</span> | `spoon` | <span class="emoji">:hocho:</span> | `hocho` <br /> `knife` |
| <span class="emoji">:amphora:</span> | `amphora` | | |

### Travel & Places

#### Place Map

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:earth_africa:</span> | `earth_africa` | <span class="emoji">:earth_americas:</span> | `earth_americas` |
| <span class="emoji">:earth_asia:</span> | `earth_asia` | <span class="emoji">:globe_with_meridians:</span> | `globe_with_meridians` |
| <span class="emoji">:world_map:</span> | `world_map` | <span class="emoji">:japan:</span> | `japan` |

#### Place Geographic

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:mountain_snow:</span> | `mountain_snow` | <span class="emoji">:mountain:</span> | `mountain` |
| <span class="emoji">:volcano:</span> | `volcano` | <span class="emoji">:mount_fuji:</span> | `mount_fuji` |
| <span class="emoji">:camping:</span> | `camping` | <span class="emoji">:beach_umbrella:</span> | `beach_umbrella` |
| <span class="emoji">:desert:</span> | `desert` | <span class="emoji">:desert_island:</span> | `desert_island` |
| <span class="emoji">:national_park:</span> | `national_park` | | |

#### Place Building

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:stadium:</span> | `stadium` | <span class="emoji">:classical_building:</span> | `classical_building` |
| <span class="emoji">:building_construction:</span> | `building_construction` | <span class="emoji">:houses:</span> | `houses` |
| <span class="emoji">:derelict_house:</span> | `derelict_house` | <span class="emoji">:house:</span> | `house` |
| <span class="emoji">:house_with_garden:</span> | `house_with_garden` | <span class="emoji">:office:</span> | `office` |
| <span class="emoji">:post_office:</span> | `post_office` | <span class="emoji">:european_post_office:</span> | `european_post_office` |
| <span class="emoji">:hospital:</span> | `hospital` | <span class="emoji">:bank:</span> | `bank` |
| <span class="emoji">:hotel:</span> | `hotel` | <span class="emoji">:love_hotel:</span> | `love_hotel` |
| <span class="emoji">:convenience_store:</span> | `convenience_store` | <span class="emoji">:school:</span> | `school` |
| <span class="emoji">:department_store:</span> | `department_store` | <span class="emoji">:factory:</span> | `factory` |
| <span class="emoji">:japanese_castle:</span> | `japanese_castle` | <span class="emoji">:european_castle:</span> | `european_castle` |
| <span class="emoji">:wedding:</span> | `wedding` | <span class="emoji">:tokyo_tower:</span> | `tokyo_tower` |
| <span class="emoji">:statue_of_liberty:</span> | `statue_of_liberty` | | |

#### Place Religious

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:church:</span> | `church` | <span class="emoji">:mosque:</span> | `mosque` |
| <span class="emoji">:synagogue:</span> | `synagogue` | <span class="emoji">:shinto_shrine:</span> | `shinto_shrine` |
| <span class="emoji">:kaaba:</span> | `kaaba` | | |

#### Place Other

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:fountain:</span> | `fountain` | <span class="emoji">:tent:</span> | `tent` |
| <span class="emoji">:foggy:</span> | `foggy` | <span class="emoji">:night_with_stars:</span> | `night_with_stars` |
| <span class="emoji">:cityscape:</span> | `cityscape` | <span class="emoji">:sunrise_over_mountains:</span> | `sunrise_over_mountains` |
| <span class="emoji">:sunrise:</span> | `sunrise` | <span class="emoji">:city_sunset:</span> | `city_sunset` |
| <span class="emoji">:city_sunrise:</span> | `city_sunrise` | <span class="emoji">:bridge_at_night:</span> | `bridge_at_night` |
| <span class="emoji">:hotsprings:</span> | `hotsprings` | <span class="emoji">:carousel_horse:</span> | `carousel_horse` |
| <span class="emoji">:ferris_wheel:</span> | `ferris_wheel` | <span class="emoji">:roller_coaster:</span> | `roller_coaster` |
| <span class="emoji">:barber:</span> | `barber` | <span class="emoji">:circus_tent:</span> | `circus_tent` |

#### Transport Ground

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:steam_locomotive:</span> | `steam_locomotive` | <span class="emoji">:railway_car:</span> | `railway_car` |
| <span class="emoji">:bullettrain_side:</span> | `bullettrain_side` | <span class="emoji">:bullettrain_front:</span> | `bullettrain_front` |
| <span class="emoji">:train2:</span> | `train2` | <span class="emoji">:metro:</span> | `metro` |
| <span class="emoji">:light_rail:</span> | `light_rail` | <span class="emoji">:station:</span> | `station` |
| <span class="emoji">:tram:</span> | `tram` | <span class="emoji">:monorail:</span> | `monorail` |
| <span class="emoji">:mountain_railway:</span> | `mountain_railway` | <span class="emoji">:train:</span> | `train` |
| <span class="emoji">:bus:</span> | `bus` | <span class="emoji">:oncoming_bus:</span> | `oncoming_bus` |
| <span class="emoji">:trolleybus:</span> | `trolleybus` | <span class="emoji">:minibus:</span> | `minibus` |
| <span class="emoji">:ambulance:</span> | `ambulance` | <span class="emoji">:fire_engine:</span> | `fire_engine` |
| <span class="emoji">:police_car:</span> | `police_car` | <span class="emoji">:oncoming_police_car:</span> | `oncoming_police_car` |
| <span class="emoji">:taxi:</span> | `taxi` | <span class="emoji">:oncoming_taxi:</span> | `oncoming_taxi` |
| <span class="emoji">:car:</span> | `car` <br /> `red_car` | <span class="emoji">:oncoming_automobile:</span> | `oncoming_automobile` |
| <span class="emoji">:blue_car:</span> | `blue_car` | <span class="emoji">:truck:</span> | `truck` |
| <span class="emoji">:articulated_lorry:</span> | `articulated_lorry` | <span class="emoji">:tractor:</span> | `tractor` |
| <span class="emoji">:racing_car:</span> | `racing_car` | <span class="emoji">:motorcycle:</span> | `motorcycle` |
| <span class="emoji">:motor_scooter:</span> | `motor_scooter` | <span class="emoji">:bike:</span> | `bike` |
| <span class="emoji">:kick_scooter:</span> | `kick_scooter` | <span class="emoji">:busstop:</span> | `busstop` |
| <span class="emoji">:motorway:</span> | `motorway` | <span class="emoji">:railway_track:</span> | `railway_track` |
| <span class="emoji">:oil_drum:</span> | `oil_drum` | <span class="emoji">:fuelpump:</span> | `fuelpump` |
| <span class="emoji">:rotating_light:</span> | `rotating_light` | <span class="emoji">:traffic_light:</span> | `traffic_light` |
| <span class="emoji">:vertical_traffic_light:</span> | `vertical_traffic_light` | <span class="emoji">:stop_sign:</span> | `stop_sign` |
| <span class="emoji">:construction:</span> | `construction` | | |

#### Transport Water

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:anchor:</span> | `anchor` | <span class="emoji">:boat:</span> | `boat` <br /> `sailboat` |
| <span class="emoji">:canoe:</span> | `canoe` | <span class="emoji">:speedboat:</span> | `speedboat` |
| <span class="emoji">:passenger_ship:</span> | `passenger_ship` | <span class="emoji">:ferry:</span> | `ferry` |
| <span class="emoji">:motor_boat:</span> | `motor_boat` | <span class="emoji">:ship:</span> | `ship` |

#### Transport Air

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:airplane:</span> | `airplane` | <span class="emoji">:small_airplane:</span> | `small_airplane` |
| <span class="emoji">:flight_departure:</span> | `flight_departure` | <span class="emoji">:flight_arrival:</span> | `flight_arrival` |
| <span class="emoji">:seat:</span> | `seat` | <span class="emoji">:helicopter:</span> | `helicopter` |
| <span class="emoji">:suspension_railway:</span> | `suspension_railway` | <span class="emoji">:mountain_cableway:</span> | `mountain_cableway` |
| <span class="emoji">:aerial_tramway:</span> | `aerial_tramway` | <span class="emoji">:artificial_satellite:</span> | `artificial_satellite` |
| <span class="emoji">:rocket:</span> | `rocket` | | |

#### Hotel

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:bellhop_bell:</span> | `bellhop_bell` |

#### Time

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:hourglass:</span> | `hourglass` | <span class="emoji">:hourglass_flowing_sand:</span> | `hourglass_flowing_sand` |
| <span class="emoji">:watch:</span> | `watch` | <span class="emoji">:alarm_clock:</span> | `alarm_clock` |
| <span class="emoji">:stopwatch:</span> | `stopwatch` | <span class="emoji">:timer_clock:</span> | `timer_clock` |
| <span class="emoji">:mantelpiece_clock:</span> | `mantelpiece_clock` | <span class="emoji">:clock12:</span> | `clock12` |
| <span class="emoji">:clock1230:</span> | `clock1230` | <span class="emoji">:clock1:</span> | `clock1` |
| <span class="emoji">:clock130:</span> | `clock130` | <span class="emoji">:clock2:</span> | `clock2` |
| <span class="emoji">:clock230:</span> | `clock230` | <span class="emoji">:clock3:</span> | `clock3` |
| <span class="emoji">:clock330:</span> | `clock330` | <span class="emoji">:clock4:</span> | `clock4` |
| <span class="emoji">:clock430:</span> | `clock430` | <span class="emoji">:clock5:</span> | `clock5` |
| <span class="emoji">:clock530:</span> | `clock530` | <span class="emoji">:clock6:</span> | `clock6` |
| <span class="emoji">:clock630:</span> | `clock630` | <span class="emoji">:clock7:</span> | `clock7` |
| <span class="emoji">:clock730:</span> | `clock730` | <span class="emoji">:clock8:</span> | `clock8` |
| <span class="emoji">:clock830:</span> | `clock830` | <span class="emoji">:clock9:</span> | `clock9` |
| <span class="emoji">:clock930:</span> | `clock930` | <span class="emoji">:clock10:</span> | `clock10` |
| <span class="emoji">:clock1030:</span> | `clock1030` | <span class="emoji">:clock11:</span> | `clock11` |
| <span class="emoji">:clock1130:</span> | `clock1130` | | |

#### Sky & Weather

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:new_moon:</span> | `new_moon` | <span class="emoji">:waxing_crescent_moon:</span> | `waxing_crescent_moon` |
| <span class="emoji">:first_quarter_moon:</span> | `first_quarter_moon` | <span class="emoji">:moon:</span> | `moon` <br /> `waxing_gibbous_moon` |
| <span class="emoji">:full_moon:</span> | `full_moon` | <span class="emoji">:waning_gibbous_moon:</span> | `waning_gibbous_moon` |
| <span class="emoji">:last_quarter_moon:</span> | `last_quarter_moon` | <span class="emoji">:waning_crescent_moon:</span> | `waning_crescent_moon` |
| <span class="emoji">:crescent_moon:</span> | `crescent_moon` | <span class="emoji">:new_moon_with_face:</span> | `new_moon_with_face` |
| <span class="emoji">:first_quarter_moon_with_face:</span> | `first_quarter_moon_with_face` | <span class="emoji">:last_quarter_moon_with_face:</span> | `last_quarter_moon_with_face` |
| <span class="emoji">:thermometer:</span> | `thermometer` | <span class="emoji">:sunny:</span> | `sunny` |
| <span class="emoji">:full_moon_with_face:</span> | `full_moon_with_face` | <span class="emoji">:sun_with_face:</span> | `sun_with_face` |
| <span class="emoji">:star:</span> | `star` | <span class="emoji">:star2:</span> | `star2` |
| <span class="emoji">:stars:</span> | `stars` | <span class="emoji">:milky_way:</span> | `milky_way` |
| <span class="emoji">:cloud:</span> | `cloud` | <span class="emoji">:partly_sunny:</span> | `partly_sunny` |
| <span class="emoji">:cloud_with_lightning_and_rain:</span> | `cloud_with_lightning_and_rain` | <span class="emoji">:sun_behind_small_cloud:</span> | `sun_behind_small_cloud` |
| <span class="emoji">:sun_behind_large_cloud:</span> | `sun_behind_large_cloud` | <span class="emoji">:sun_behind_rain_cloud:</span> | `sun_behind_rain_cloud` |
| <span class="emoji">:cloud_with_rain:</span> | `cloud_with_rain` | <span class="emoji">:cloud_with_snow:</span> | `cloud_with_snow` |
| <span class="emoji">:cloud_with_lightning:</span> | `cloud_with_lightning` | <span class="emoji">:tornado:</span> | `tornado` |
| <span class="emoji">:fog:</span> | `fog` | <span class="emoji">:wind_face:</span> | `wind_face` |
| <span class="emoji">:cyclone:</span> | `cyclone` | <span class="emoji">:rainbow:</span> | `rainbow` |
| <span class="emoji">:closed_umbrella:</span> | `closed_umbrella` | <span class="emoji">:open_umbrella:</span> | `open_umbrella` |
| <span class="emoji">:umbrella:</span> | `umbrella` | <span class="emoji">:parasol_on_ground:</span> | `parasol_on_ground` |
| <span class="emoji">:zap:</span> | `zap` | <span class="emoji">:snowflake:</span> | `snowflake` |
| <span class="emoji">:snowman_with_snow:</span> | `snowman_with_snow` | <span class="emoji">:snowman:</span> | `snowman` |
| <span class="emoji">:comet:</span> | `comet` | <span class="emoji">:fire:</span> | `fire` |
| <span class="emoji">:droplet:</span> | `droplet` | <span class="emoji">:ocean:</span> | `ocean` |

### Activities

#### Event

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:jack_o_lantern:</span> | `jack_o_lantern` | <span class="emoji">:christmas_tree:</span> | `christmas_tree` |
| <span class="emoji">:fireworks:</span> | `fireworks` | <span class="emoji">:sparkler:</span> | `sparkler` |
| <span class="emoji">:sparkles:</span> | `sparkles` | <span class="emoji">:balloon:</span> | `balloon` |
| <span class="emoji">:tada:</span> | `tada` | <span class="emoji">:confetti_ball:</span> | `confetti_ball` |
| <span class="emoji">:tanabata_tree:</span> | `tanabata_tree` | <span class="emoji">:bamboo:</span> | `bamboo` |
| <span class="emoji">:dolls:</span> | `dolls` | <span class="emoji">:flags:</span> | `flags` |
| <span class="emoji">:wind_chime:</span> | `wind_chime` | <span class="emoji">:rice_scene:</span> | `rice_scene` |
| <span class="emoji">:ribbon:</span> | `ribbon` | <span class="emoji">:gift:</span> | `gift` |
| <span class="emoji">:reminder_ribbon:</span> | `reminder_ribbon` | <span class="emoji">:tickets:</span> | `tickets` |
| <span class="emoji">:ticket:</span> | `ticket` | | |

#### Award Medal

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:medal_military:</span> | `medal_military` | <span class="emoji">:trophy:</span> | `trophy` |
| <span class="emoji">:medal_sports:</span> | `medal_sports` | <span class="emoji">:1st_place_medal:</span> | `1st_place_medal` |
| <span class="emoji">:2nd_place_medal:</span> | `2nd_place_medal` | <span class="emoji">:3rd_place_medal:</span> | `3rd_place_medal` |

#### Sport

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:soccer:</span> | `soccer` | <span class="emoji">:baseball:</span> | `baseball` |
| <span class="emoji">:basketball:</span> | `basketball` | <span class="emoji">:volleyball:</span> | `volleyball` |
| <span class="emoji">:football:</span> | `football` | <span class="emoji">:rugby_football:</span> | `rugby_football` |
| <span class="emoji">:tennis:</span> | `tennis` | <span class="emoji">:bowling:</span> | `bowling` |
| <span class="emoji">:cricket:</span> | `cricket` | <span class="emoji">:field_hockey:</span> | `field_hockey` |
| <span class="emoji">:ice_hockey:</span> | `ice_hockey` | <span class="emoji">:ping_pong:</span> | `ping_pong` |
| <span class="emoji">:badminton:</span> | `badminton` | <span class="emoji">:boxing_glove:</span> | `boxing_glove` |
| <span class="emoji">:martial_arts_uniform:</span> | `martial_arts_uniform` | <span class="emoji">:goal_net:</span> | `goal_net` |
| <span class="emoji">:golf:</span> | `golf` | <span class="emoji">:ice_skate:</span> | `ice_skate` |
| <span class="emoji">:fishing_pole_and_fish:</span> | `fishing_pole_and_fish` | <span class="emoji">:running_shirt_with_sash:</span> | `running_shirt_with_sash` |
| <span class="emoji">:ski:</span> | `ski` | | |

#### Game

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:dart:</span> | `dart` | <span class="emoji">:8ball:</span> | `8ball` |
| <span class="emoji">:crystal_ball:</span> | `crystal_ball` | <span class="emoji">:video_game:</span> | `video_game` |
| <span class="emoji">:joystick:</span> | `joystick` | <span class="emoji">:slot_machine:</span> | `slot_machine` |
| <span class="emoji">:game_die:</span> | `game_die` | <span class="emoji">:spades:</span> | `spades` |
| <span class="emoji">:hearts:</span> | `hearts` | <span class="emoji">:diamonds:</span> | `diamonds` |
| <span class="emoji">:clubs:</span> | `clubs` | <span class="emoji">:black_joker:</span> | `black_joker` |
| <span class="emoji">:mahjong:</span> | `mahjong` | <span class="emoji">:flower_playing_cards:</span> | `flower_playing_cards` |

#### Arts & Crafts

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:performing_arts:</span> | `performing_arts` | <span class="emoji">:framed_picture:</span> | `framed_picture` |
| <span class="emoji">:art:</span> | `art` | | |

### Objects

#### Clothing

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:eyeglasses:</span> | `eyeglasses` | <span class="emoji">:dark_sunglasses:</span> | `dark_sunglasses` |
| <span class="emoji">:necktie:</span> | `necktie` | <span class="emoji">:shirt:</span> | `shirt` <br /> `tshirt` |
| <span class="emoji">:jeans:</span> | `jeans` | <span class="emoji">:dress:</span> | `dress` |
| <span class="emoji">:kimono:</span> | `kimono` | <span class="emoji">:bikini:</span> | `bikini` |
| <span class="emoji">:womans_clothes:</span> | `womans_clothes` | <span class="emoji">:purse:</span> | `purse` |
| <span class="emoji">:handbag:</span> | `handbag` | <span class="emoji">:pouch:</span> | `pouch` |
| <span class="emoji">:shopping:</span> | `shopping` | <span class="emoji">:school_satchel:</span> | `school_satchel` |
| <span class="emoji">:mans_shoe:</span> | `mans_shoe` <br /> `shoe` | <span class="emoji">:athletic_shoe:</span> | `athletic_shoe` |
| <span class="emoji">:high_heel:</span> | `high_heel` | <span class="emoji">:sandal:</span> | `sandal` |
| <span class="emoji">:boot:</span> | `boot` | <span class="emoji">:crown:</span> | `crown` |
| <span class="emoji">:womans_hat:</span> | `womans_hat` | <span class="emoji">:tophat:</span> | `tophat` |
| <span class="emoji">:mortar_board:</span> | `mortar_board` | <span class="emoji">:rescue_worker_helmet:</span> | `rescue_worker_helmet` |
| <span class="emoji">:prayer_beads:</span> | `prayer_beads` | <span class="emoji">:lipstick:</span> | `lipstick` |
| <span class="emoji">:ring:</span> | `ring` | <span class="emoji">:gem:</span> | `gem` |

#### Sound

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:mute:</span> | `mute` | <span class="emoji">:speaker:</span> | `speaker` |
| <span class="emoji">:sound:</span> | `sound` | <span class="emoji">:loud_sound:</span> | `loud_sound` |
| <span class="emoji">:loudspeaker:</span> | `loudspeaker` | <span class="emoji">:mega:</span> | `mega` |
| <span class="emoji">:postal_horn:</span> | `postal_horn` | <span class="emoji">:bell:</span> | `bell` |
| <span class="emoji">:no_bell:</span> | `no_bell` | | |

#### Music

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:musical_score:</span> | `musical_score` | <span class="emoji">:musical_note:</span> | `musical_note` |
| <span class="emoji">:notes:</span> | `notes` | <span class="emoji">:studio_microphone:</span> | `studio_microphone` |
| <span class="emoji">:level_slider:</span> | `level_slider` | <span class="emoji">:control_knobs:</span> | `control_knobs` |
| <span class="emoji">:microphone:</span> | `microphone` | <span class="emoji">:headphones:</span> | `headphones` |
| <span class="emoji">:radio:</span> | `radio` | | |

#### Musical Instrument

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:saxophone:</span> | `saxophone` | <span class="emoji">:guitar:</span> | `guitar` |
| <span class="emoji">:musical_keyboard:</span> | `musical_keyboard` | <span class="emoji">:trumpet:</span> | `trumpet` |
| <span class="emoji">:violin:</span> | `violin` | <span class="emoji">:drum:</span> | `drum` |

#### Phone

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:iphone:</span> | `iphone` | <span class="emoji">:calling:</span> | `calling` |
| <span class="emoji">:phone:</span> | `phone` <br /> `telephone` | <span class="emoji">:telephone_receiver:</span> | `telephone_receiver` |
| <span class="emoji">:pager:</span> | `pager` | <span class="emoji">:fax:</span> | `fax` |

#### Computer

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:battery:</span> | `battery` | <span class="emoji">:electric_plug:</span> | `electric_plug` |
| <span class="emoji">:computer:</span> | `computer` | <span class="emoji">:desktop_computer:</span> | `desktop_computer` |
| <span class="emoji">:printer:</span> | `printer` | <span class="emoji">:keyboard:</span> | `keyboard` |
| <span class="emoji">:computer_mouse:</span> | `computer_mouse` | <span class="emoji">:trackball:</span> | `trackball` |
| <span class="emoji">:minidisc:</span> | `minidisc` | <span class="emoji">:floppy_disk:</span> | `floppy_disk` |
| <span class="emoji">:cd:</span> | `cd` | <span class="emoji">:dvd:</span> | `dvd` |

#### Light & Video

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:movie_camera:</span> | `movie_camera` | <span class="emoji">:film_strip:</span> | `film_strip` |
| <span class="emoji">:film_projector:</span> | `film_projector` | <span class="emoji">:clapper:</span> | `clapper` |
| <span class="emoji">:tv:</span> | `tv` | <span class="emoji">:camera:</span> | `camera` |
| <span class="emoji">:camera_flash:</span> | `camera_flash` | <span class="emoji">:video_camera:</span> | `video_camera` |
| <span class="emoji">:vhs:</span> | `vhs` | <span class="emoji">:mag:</span> | `mag` |
| <span class="emoji">:mag_right:</span> | `mag_right` | <span class="emoji">:candle:</span> | `candle` |
| <span class="emoji">:bulb:</span> | `bulb` | <span class="emoji">:flashlight:</span> | `flashlight` |
| <span class="emoji">:izakaya_lantern:</span> | `izakaya_lantern` <br /> `lantern` | | |

#### Book Paper

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:notebook_with_decorative_cover:</span> | `notebook_with_decorative_cover` | <span class="emoji">:closed_book:</span> | `closed_book` |
| <span class="emoji">:book:</span> | `book` <br /> `open_book` | <span class="emoji">:green_book:</span> | `green_book` |
| <span class="emoji">:blue_book:</span> | `blue_book` | <span class="emoji">:orange_book:</span> | `orange_book` |
| <span class="emoji">:books:</span> | `books` | <span class="emoji">:notebook:</span> | `notebook` |
| <span class="emoji">:ledger:</span> | `ledger` | <span class="emoji">:page_with_curl:</span> | `page_with_curl` |
| <span class="emoji">:scroll:</span> | `scroll` | <span class="emoji">:page_facing_up:</span> | `page_facing_up` |
| <span class="emoji">:newspaper:</span> | `newspaper` | <span class="emoji">:newspaper_roll:</span> | `newspaper_roll` |
| <span class="emoji">:bookmark_tabs:</span> | `bookmark_tabs` | <span class="emoji">:bookmark:</span> | `bookmark` |
| <span class="emoji">:label:</span> | `label` | | |

#### Money

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:moneybag:</span> | `moneybag` | <span class="emoji">:yen:</span> | `yen` |
| <span class="emoji">:dollar:</span> | `dollar` | <span class="emoji">:euro:</span> | `euro` |
| <span class="emoji">:pound:</span> | `pound` | <span class="emoji">:money_with_wings:</span> | `money_with_wings` |
| <span class="emoji">:credit_card:</span> | `credit_card` | <span class="emoji">:chart:</span> | `chart` |

#### Mail

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:email:</span> | `email` <br /> `envelope` | :e-mail: | `:e-mail:` |
| <span class="emoji">:incoming_envelope:</span> | `incoming_envelope` | <span class="emoji">:envelope_with_arrow:</span> | `envelope_with_arrow` |
| <span class="emoji">:outbox_tray:</span> | `outbox_tray` | <span class="emoji">:inbox_tray:</span> | `inbox_tray` |
| <span class="emoji">:package:</span> | `package` | <span class="emoji">:mailbox:</span> | `mailbox` |
| <span class="emoji">:mailbox_closed:</span> | `mailbox_closed` | <span class="emoji">:mailbox_with_mail:</span> | `mailbox_with_mail` |
| <span class="emoji">:mailbox_with_no_mail:</span> | `mailbox_with_no_mail` | <span class="emoji">:postbox:</span> | `postbox` |
| <span class="emoji">:ballot_box:</span> | `ballot_box` | | |

#### Writing

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:pencil2:</span> | `pencil2` | <span class="emoji">:black_nib:</span> | `black_nib` |
| <span class="emoji">:fountain_pen:</span> | `fountain_pen` | <span class="emoji">:pen:</span> | `pen` |
| <span class="emoji">:paintbrush:</span> | `paintbrush` | <span class="emoji">:crayon:</span> | `crayon` |
| <span class="emoji">:memo:</span> | `memo` <br /> `pencil` | | |

#### Office

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:briefcase:</span> | `briefcase` | <span class="emoji">:file_folder:</span> | `file_folder` |
| <span class="emoji">:open_file_folder:</span> | `open_file_folder` | <span class="emoji">:card_index_dividers:</span> | `card_index_dividers` |
| <span class="emoji">:date:</span> | `date` | <span class="emoji">:calendar:</span> | `calendar` |
| <span class="emoji">:spiral_notepad:</span> | `spiral_notepad` | <span class="emoji">:spiral_calendar:</span> | `spiral_calendar` |
| <span class="emoji">:card_index:</span> | `card_index` | <span class="emoji">:chart_with_upwards_trend:</span> | `chart_with_upwards_trend` |
| <span class="emoji">:chart_with_downwards_trend:</span> | `chart_with_downwards_trend` | <span class="emoji">:bar_chart:</span> | `bar_chart` |
| <span class="emoji">:clipboard:</span> | `clipboard` | <span class="emoji">:pushpin:</span> | `pushpin` |
| <span class="emoji">:round_pushpin:</span> | `round_pushpin` | <span class="emoji">:paperclip:</span> | `paperclip` |
| <span class="emoji">:paperclips:</span> | `paperclips` | <span class="emoji">:straight_ruler:</span> | `straight_ruler` |
| <span class="emoji">:triangular_ruler:</span> | `triangular_ruler` | <span class="emoji">:scissors:</span> | `scissors` |
| <span class="emoji">:card_file_box:</span> | `card_file_box` | <span class="emoji">:file_cabinet:</span> | `file_cabinet` |
| <span class="emoji">:wastebasket:</span> | `wastebasket` | | |

#### Lock

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:lock:</span> | `lock` | <span class="emoji">:unlock:</span> | `unlock` |
| <span class="emoji">:lock_with_ink_pen:</span> | `lock_with_ink_pen` | <span class="emoji">:closed_lock_with_key:</span> | `closed_lock_with_key` |
| <span class="emoji">:key:</span> | `key` | <span class="emoji">:old_key:</span> | `old_key` |

#### Tool

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:hammer:</span> | `hammer` | <span class="emoji">:pick:</span> | `pick` |
| <span class="emoji">:hammer_and_pick:</span> | `hammer_and_pick` | <span class="emoji">:hammer_and_wrench:</span> | `hammer_and_wrench` |
| <span class="emoji">:dagger:</span> | `dagger` | <span class="emoji">:crossed_swords:</span> | `crossed_swords` |
| <span class="emoji">:gun:</span> | `gun` | <span class="emoji">:bow_and_arrow:</span> | `bow_and_arrow` |
| <span class="emoji">:shield:</span> | `shield` | <span class="emoji">:wrench:</span> | `wrench` |
| <span class="emoji">:nut_and_bolt:</span> | `nut_and_bolt` | <span class="emoji">:gear:</span> | `gear` |
| <span class="emoji">:clamp:</span> | `clamp` | <span class="emoji">:balance_scale:</span> | `balance_scale` |
| <span class="emoji">:link:</span> | `link` | <span class="emoji">:chains:</span> | `chains` |

#### Science

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:alembic:</span> | `alembic` | <span class="emoji">:microscope:</span> | `microscope` |
| <span class="emoji">:telescope:</span> | `telescope` | <span class="emoji">:satellite:</span> | `satellite` |

#### Medical

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:syringe:</span> | `syringe` | <span class="emoji">:pill:</span> | `pill` |

#### Household

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:door:</span> | `door` | <span class="emoji">:bed:</span> | `bed` |
| <span class="emoji">:couch_and_lamp:</span> | `couch_and_lamp` | <span class="emoji">:toilet:</span> | `toilet` |
| <span class="emoji">:shower:</span> | `shower` | <span class="emoji">:bathtub:</span> | `bathtub` |
| <span class="emoji">:shopping_cart:</span> | `shopping_cart` | | |

#### Other Object

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:smoking:</span> | `smoking` | <span class="emoji">:coffin:</span> | `coffin` |
| <span class="emoji">:funeral_urn:</span> | `funeral_urn` | <span class="emoji">:moyai:</span> | `moyai` |

### Symbols

#### Transport Sign

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:atm:</span> | `atm` | <span class="emoji">:put_litter_in_its_place:</span> | `put_litter_in_its_place` |
| <span class="emoji">:potable_water:</span> | `potable_water` | <span class="emoji">:wheelchair:</span> | `wheelchair` |
| <span class="emoji">:mens:</span> | `mens` | <span class="emoji">:womens:</span> | `womens` |
| <span class="emoji">:restroom:</span> | `restroom` | <span class="emoji">:baby_symbol:</span> | `baby_symbol` |
| <span class="emoji">:wc:</span> | `wc` | <span class="emoji">:passport_control:</span> | `passport_control` |
| <span class="emoji">:customs:</span> | `customs` | <span class="emoji">:baggage_claim:</span> | `baggage_claim` |
| <span class="emoji">:left_luggage:</span> | `left_luggage` | | |

#### Warning

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:warning:</span> | `warning` | <span class="emoji">:children_crossing:</span> | `children_crossing` |
| <span class="emoji">:no_entry:</span> | `no_entry` | <span class="emoji">:no_entry_sign:</span> | `no_entry_sign` |
| <span class="emoji">:no_bicycles:</span> | `no_bicycles` | <span class="emoji">:no_smoking:</span> | `no_smoking` |
| <span class="emoji">:do_not_litter:</span> | `do_not_litter` | :non-potable_water: | `:non-potable_water:` |
| <span class="emoji">:no_pedestrians:</span> | `no_pedestrians` | <span class="emoji">:no_mobile_phones:</span> | `no_mobile_phones` |
| <span class="emoji">:underage:</span> | `underage` | <span class="emoji">:radioactive:</span> | `radioactive` |
| <span class="emoji">:biohazard:</span> | `biohazard` | | |

#### Arrow

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:arrow_up:</span> | `arrow_up` | <span class="emoji">:arrow_upper_right:</span> | `arrow_upper_right` |
| <span class="emoji">:arrow_right:</span> | `arrow_right` | <span class="emoji">:arrow_lower_right:</span> | `arrow_lower_right` |
| <span class="emoji">:arrow_down:</span> | `arrow_down` | <span class="emoji">:arrow_lower_left:</span> | `arrow_lower_left` |
| <span class="emoji">:arrow_left:</span> | `arrow_left` | <span class="emoji">:arrow_upper_left:</span> | `arrow_upper_left` |
| <span class="emoji">:arrow_up_down:</span> | `arrow_up_down` | <span class="emoji">:left_right_arrow:</span> | `left_right_arrow` |
| <span class="emoji">:leftwards_arrow_with_hook:</span> | `leftwards_arrow_with_hook` | <span class="emoji">:arrow_right_hook:</span> | `arrow_right_hook` |
| <span class="emoji">:arrow_heading_up:</span> | `arrow_heading_up` | <span class="emoji">:arrow_heading_down:</span> | `arrow_heading_down` |
| <span class="emoji">:arrows_clockwise:</span> | `arrows_clockwise` | <span class="emoji">:arrows_counterclockwise:</span> | `arrows_counterclockwise` |
| <span class="emoji">:back:</span> | `back` | <span class="emoji">:end:</span> | `end` |
| <span class="emoji">:on:</span> | `on` | <span class="emoji">:soon:</span> | `soon` |
| <span class="emoji">:top:</span> | `top` | | |

#### Religion

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:place_of_worship:</span> | `place_of_worship` | <span class="emoji">:atom_symbol:</span> | `atom_symbol` |
| <span class="emoji">:om:</span> | `om` | <span class="emoji">:star_of_david:</span> | `star_of_david` |
| <span class="emoji">:wheel_of_dharma:</span> | `wheel_of_dharma` | <span class="emoji">:yin_yang:</span> | `yin_yang` |
| <span class="emoji">:latin_cross:</span> | `latin_cross` | <span class="emoji">:orthodox_cross:</span> | `orthodox_cross` |
| <span class="emoji">:star_and_crescent:</span> | `star_and_crescent` | <span class="emoji">:peace_symbol:</span> | `peace_symbol` |
| <span class="emoji">:menorah:</span> | `menorah` | <span class="emoji">:six_pointed_star:</span> | `six_pointed_star` |

#### Zodiac

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:aries:</span> | `aries` | <span class="emoji">:taurus:</span> | `taurus` |
| <span class="emoji">:gemini:</span> | `gemini` | <span class="emoji">:cancer:</span> | `cancer` |
| <span class="emoji">:leo:</span> | `leo` | <span class="emoji">:virgo:</span> | `virgo` |
| <span class="emoji">:libra:</span> | `libra` | <span class="emoji">:scorpius:</span> | `scorpius` |
| <span class="emoji">:sagittarius:</span> | `sagittarius` | <span class="emoji">:capricorn:</span> | `capricorn` |
| <span class="emoji">:aquarius:</span> | `aquarius` | <span class="emoji">:pisces:</span> | `pisces` |
| <span class="emoji">:ophiuchus:</span> | `ophiuchus` | | |

#### Av Symbol

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:twisted_rightwards_arrows:</span> | `twisted_rightwards_arrows` | <span class="emoji">:repeat:</span> | `repeat` |
| <span class="emoji">:repeat_one:</span> | `repeat_one` | <span class="emoji">:arrow_forward:</span> | `arrow_forward` |
| <span class="emoji">:fast_forward:</span> | `fast_forward` | <span class="emoji">:next_track_button:</span> | `next_track_button` |
| <span class="emoji">:play_or_pause_button:</span> | `play_or_pause_button` | <span class="emoji">:arrow_backward:</span> | `arrow_backward` |
| <span class="emoji">:rewind:</span> | `rewind` | <span class="emoji">:previous_track_button:</span> | `previous_track_button` |
| <span class="emoji">:arrow_up_small:</span> | `arrow_up_small` | <span class="emoji">:arrow_double_up:</span> | `arrow_double_up` |
| <span class="emoji">:arrow_down_small:</span> | `arrow_down_small` | <span class="emoji">:arrow_double_down:</span> | `arrow_double_down` |
| <span class="emoji">:pause_button:</span> | `pause_button` | <span class="emoji">:stop_button:</span> | `stop_button` |
| <span class="emoji">:record_button:</span> | `record_button` | <span class="emoji">:cinema:</span> | `cinema` |
| <span class="emoji">:low_brightness:</span> | `low_brightness` | <span class="emoji">:high_brightness:</span> | `high_brightness` |
| <span class="emoji">:signal_strength:</span> | `signal_strength` | <span class="emoji">:vibration_mode:</span> | `vibration_mode` |
| <span class="emoji">:mobile_phone_off:</span> | `mobile_phone_off` | | |

#### Math

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:heavy_multiplication_x:</span> | `heavy_multiplication_x` | <span class="emoji">:heavy_plus_sign:</span> | `heavy_plus_sign` |
| <span class="emoji">:heavy_minus_sign:</span> | `heavy_minus_sign` | <span class="emoji">:heavy_division_sign:</span> | `heavy_division_sign` |

#### Punctuation

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:bangbang:</span> | `bangbang` | <span class="emoji">:interrobang:</span> | `interrobang` |
| <span class="emoji">:question:</span> | `question` | <span class="emoji">:grey_question:</span> | `grey_question` |
| <span class="emoji">:grey_exclamation:</span> | `grey_exclamation` | <span class="emoji">:exclamation:</span> | `exclamation` <br /> `heavy_exclamation_mark` |
| <span class="emoji">:wavy_dash:</span> | `wavy_dash` | | |

#### Currency

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:currency_exchange:</span> | `currency_exchange` | <span class="emoji">:heavy_dollar_sign:</span> | `heavy_dollar_sign` |

#### Keycap

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:hash:</span> | `hash` | <span class="emoji">:asterisk:</span> | `asterisk` |
| <span class="emoji">:zero:</span> | `zero` | <span class="emoji">:one:</span> | `one` |
| <span class="emoji">:two:</span> | `two` | <span class="emoji">:three:</span> | `three` |
| <span class="emoji">:four:</span> | `four` | <span class="emoji">:five:</span> | `five` |
| <span class="emoji">:six:</span> | `six` | <span class="emoji">:seven:</span> | `seven` |
| <span class="emoji">:eight:</span> | `eight` | <span class="emoji">:nine:</span> | `nine` |
| <span class="emoji">:keycap_ten:</span> | `keycap_ten` | | |

#### Alphabet

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:capital_abcd:</span> | `capital_abcd` | <span class="emoji">:abcd:</span> | `abcd` |
| <span class="emoji">:1234:</span> | `1234` | <span class="emoji">:symbols:</span> | `symbols` |
| <span class="emoji">:abc:</span> | `abc` | <span class="emoji">:a:</span> | `a` |
| <span class="emoji">:ab:</span> | `ab` | <span class="emoji">:b:</span> | `b` |
| <span class="emoji">:cl:</span> | `cl` | <span class="emoji">:cool:</span> | `cool` |
| <span class="emoji">:free:</span> | `free` | <span class="emoji">:information_source:</span> | `information_source` |
| <span class="emoji">:id:</span> | `id` | <span class="emoji">:m:</span> | `m` |
| <span class="emoji">:new:</span> | `new` | <span class="emoji">:ng:</span> | `ng` |
| <span class="emoji">:o2:</span> | `o2` | <span class="emoji">:ok:</span> | `ok` |
| <span class="emoji">:parking:</span> | `parking` | <span class="emoji">:sos:</span> | `sos` |
| <span class="emoji">:up:</span> | `up` | <span class="emoji">:vs:</span> | `vs` |
| <span class="emoji">:koko:</span> | `koko` | <span class="emoji">:sa:</span> | `sa` |
| <span class="emoji">:u6708:</span> | `u6708` | <span class="emoji">:u6709:</span> | `u6709` |
| <span class="emoji">:u6307:</span> | `u6307` | <span class="emoji">:ideograph_advantage:</span> | `ideograph_advantage` |
| <span class="emoji">:u5272:</span> | `u5272` | <span class="emoji">:u7121:</span> | `u7121` |
| <span class="emoji">:u7981:</span> | `u7981` | <span class="emoji">:accept:</span> | `accept` |
| <span class="emoji">:u7533:</span> | `u7533` | <span class="emoji">:u5408:</span> | `u5408` |
| <span class="emoji">:u7a7a:</span> | `u7a7a` | <span class="emoji">:congratulations:</span> | `congratulations` |
| <span class="emoji">:secret:</span> | `secret` | <span class="emoji">:u55b6:</span> | `u55b6` |
| <span class="emoji">:u6e80:</span> | `u6e80` | | |

#### Geometric

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:red_circle:</span> | `red_circle` | <span class="emoji">:large_blue_circle:</span> | `large_blue_circle` |
| <span class="emoji">:black_circle:</span> | `black_circle` | <span class="emoji">:white_circle:</span> | `white_circle` |
| <span class="emoji">:black_large_square:</span> | `black_large_square` | <span class="emoji">:white_large_square:</span> | `white_large_square` |
| <span class="emoji">:black_medium_square:</span> | `black_medium_square` | <span class="emoji">:white_medium_square:</span> | `white_medium_square` |
| <span class="emoji">:black_medium_small_square:</span> | `black_medium_small_square` | <span class="emoji">:white_medium_small_square:</span> | `white_medium_small_square` |
| <span class="emoji">:black_small_square:</span> | `black_small_square` | <span class="emoji">:white_small_square:</span> | `white_small_square` |
| <span class="emoji">:large_orange_diamond:</span> | `large_orange_diamond` | <span class="emoji">:large_blue_diamond:</span> | `large_blue_diamond` |
| <span class="emoji">:small_orange_diamond:</span> | `small_orange_diamond` | <span class="emoji">:small_blue_diamond:</span> | `small_blue_diamond` |
| <span class="emoji">:small_red_triangle:</span> | `small_red_triangle` | <span class="emoji">:small_red_triangle_down:</span> | `small_red_triangle_down` |
| <span class="emoji">:diamond_shape_with_a_dot_inside:</span> | `diamond_shape_with_a_dot_inside` | <span class="emoji">:radio_button:</span> | `radio_button` |
| <span class="emoji">:white_square_button:</span> | `white_square_button` | <span class="emoji">:black_square_button:</span> | `black_square_button` |

#### Other Symbol

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:recycle:</span> | `recycle` | <span class="emoji">:fleur_de_lis:</span> | `fleur_de_lis` |
| <span class="emoji">:trident:</span> | `trident` | <span class="emoji">:name_badge:</span> | `name_badge` |
| <span class="emoji">:beginner:</span> | `beginner` | <span class="emoji">:o:</span> | `o` |
| <span class="emoji">:white_check_mark:</span> | `white_check_mark` | <span class="emoji">:ballot_box_with_check:</span> | `ballot_box_with_check` |
| <span class="emoji">:heavy_check_mark:</span> | `heavy_check_mark` | <span class="emoji">:x:</span> | `x` |
| <span class="emoji">:negative_squared_cross_mark:</span> | `negative_squared_cross_mark` | <span class="emoji">:curly_loop:</span> | `curly_loop` |
| <span class="emoji">:loop:</span> | `loop` | <span class="emoji">:part_alternation_mark:</span> | `part_alternation_mark` |
| <span class="emoji">:eight_spoked_asterisk:</span> | `eight_spoked_asterisk` | <span class="emoji">:eight_pointed_black_star:</span> | `eight_pointed_black_star` |
| <span class="emoji">:sparkle:</span> | `sparkle` | <span class="emoji">:copyright:</span> | `copyright` |
| <span class="emoji">:registered:</span> | `registered` | <span class="emoji">:tm:</span> | `tm` |

### Flags

#### Common Flags

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:checkered_flag:</span> | `checkered_flag` | <span class="emoji">:triangular_flag_on_post:</span> | `triangular_flag_on_post` |
| <span class="emoji">:crossed_flags:</span> | `crossed_flags` | <span class="emoji">:black_flag:</span> | `black_flag` |
| <span class="emoji">:white_flag:</span> | `white_flag` | <span class="emoji">:rainbow_flag:</span> | `rainbow_flag` |

#### Country and Region Flags

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:andorra:</span> | `andorra` | <span class="emoji">:united_arab_emirates:</span> | `united_arab_emirates` |
| <span class="emoji">:afghanistan:</span> | `afghanistan` | <span class="emoji">:antigua_barbuda:</span> | `antigua_barbuda` |
| <span class="emoji">:anguilla:</span> | `anguilla` | <span class="emoji">:albania:</span> | `albania` |
| <span class="emoji">:armenia:</span> | `armenia` | <span class="emoji">:angola:</span> | `angola` |
| <span class="emoji">:antarctica:</span> | `antarctica` | <span class="emoji">:argentina:</span> | `argentina` |
| <span class="emoji">:american_samoa:</span> | `american_samoa` | <span class="emoji">:austria:</span> | `austria` |
| <span class="emoji">:australia:</span> | `australia` | <span class="emoji">:aruba:</span> | `aruba` |
| <span class="emoji">:aland_islands:</span> | `aland_islands` | <span class="emoji">:azerbaijan:</span> | `azerbaijan` |
| <span class="emoji">:bosnia_herzegovina:</span> | `bosnia_herzegovina` | <span class="emoji">:barbados:</span> | `barbados` |
| <span class="emoji">:bangladesh:</span> | `bangladesh` | <span class="emoji">:belgium:</span> | `belgium` |
| <span class="emoji">:burkina_faso:</span> | `burkina_faso` | <span class="emoji">:bulgaria:</span> | `bulgaria` |
| <span class="emoji">:bahrain:</span> | `bahrain` | <span class="emoji">:burundi:</span> | `burundi` |
| <span class="emoji">:benin:</span> | `benin` | <span class="emoji">:st_barthelemy:</span> | `st_barthelemy` |
| <span class="emoji">:bermuda:</span> | `bermuda` | <span class="emoji">:brunei:</span> | `brunei` |
| <span class="emoji">:bolivia:</span> | `bolivia` | <span class="emoji">:caribbean_netherlands:</span> | `caribbean_netherlands` |
| <span class="emoji">:brazil:</span> | `brazil` | <span class="emoji">:bahamas:</span> | `bahamas` |
| <span class="emoji">:bhutan:</span> | `bhutan` | <span class="emoji">:botswana:</span> | `botswana` |
| <span class="emoji">:belarus:</span> | `belarus` | <span class="emoji">:belize:</span> | `belize` |
| <span class="emoji">:canada:</span> | `canada` | <span class="emoji">:cocos_islands:</span> | `cocos_islands` |
| <span class="emoji">:congo_kinshasa:</span> | `congo_kinshasa` | <span class="emoji">:central_african_republic:</span> | `central_african_republic` |
| <span class="emoji">:congo_brazzaville:</span> | `congo_brazzaville` | <span class="emoji">:switzerland:</span> | `switzerland` |
| <span class="emoji">:cote_divoire:</span> | `cote_divoire` | <span class="emoji">:cook_islands:</span> | `cook_islands` |
| <span class="emoji">:chile:</span> | `chile` | <span class="emoji">:cameroon:</span> | `cameroon` |
| <span class="emoji">:cn:</span> | `cn` | <span class="emoji">:colombia:</span> | `colombia` |
| <span class="emoji">:costa_rica:</span> | `costa_rica` | <span class="emoji">:cuba:</span> | `cuba` |
| <span class="emoji">:cape_verde:</span> | `cape_verde` | <span class="emoji">:curacao:</span> | `curacao` |
| <span class="emoji">:christmas_island:</span> | `christmas_island` | <span class="emoji">:cyprus:</span> | `cyprus` |
| <span class="emoji">:czech_republic:</span> | `czech_republic` | <span class="emoji">:de:</span> | `de` |
| <span class="emoji">:djibouti:</span> | `djibouti` | <span class="emoji">:denmark:</span> | `denmark` |
| <span class="emoji">:dominica:</span> | `dominica` | <span class="emoji">:dominican_republic:</span> | `dominican_republic` |
| <span class="emoji">:algeria:</span> | `algeria` | <span class="emoji">:ecuador:</span> | `ecuador` |
| <span class="emoji">:estonia:</span> | `estonia` | <span class="emoji">:egypt:</span> | `egypt` |
| <span class="emoji">:western_sahara:</span> | `western_sahara` | <span class="emoji">:eritrea:</span> | `eritrea` |
| <span class="emoji">:es:</span> | `es` | <span class="emoji">:ethiopia:</span> | `ethiopia` |
| <span class="emoji">:eu:</span> | `eu` <br /> `european_union` | <span class="emoji">:finland:</span> | `finland` |
| <span class="emoji">:fiji:</span> | `fiji` | <span class="emoji">:falkland_islands:</span> | `falkland_islands` |
| <span class="emoji">:micronesia:</span> | `micronesia` | <span class="emoji">:faroe_islands:</span> | `faroe_islands` |
| <span class="emoji">:fr:</span> | `fr` | <span class="emoji">:gabon:</span> | `gabon` |
| <span class="emoji">:gb:</span> | `gb` <br /> `uk` | <span class="emoji">:grenada:</span> | `grenada` |
| <span class="emoji">:georgia:</span> | `georgia` | <span class="emoji">:french_guiana:</span> | `french_guiana` |
| <span class="emoji">:guernsey:</span> | `guernsey` | <span class="emoji">:ghana:</span> | `ghana` |
| <span class="emoji">:gibraltar:</span> | `gibraltar` | <span class="emoji">:greenland:</span> | `greenland` |
| <span class="emoji">:gambia:</span> | `gambia` | <span class="emoji">:guinea:</span> | `guinea` |
| <span class="emoji">:guadeloupe:</span> | `guadeloupe` | <span class="emoji">:equatorial_guinea:</span> | `equatorial_guinea` |
| <span class="emoji">:greece:</span> | `greece` | <span class="emoji">:south_georgia_south_sandwich_islands:</span> | `south_georgia_south_sandwich_islands` |
| <span class="emoji">:guatemala:</span> | `guatemala` | <span class="emoji">:guam:</span> | `guam` |
| <span class="emoji">:guinea_bissau:</span> | `guinea_bissau` | <span class="emoji">:guyana:</span> | `guyana` |
| <span class="emoji">:hong_kong:</span> | `hong_kong` | <span class="emoji">:honduras:</span> | `honduras` |
| <span class="emoji">:croatia:</span> | `croatia` | <span class="emoji">:haiti:</span> | `haiti` |
| <span class="emoji">:hungary:</span> | `hungary` | <span class="emoji">:canary_islands:</span> | `canary_islands` |
| <span class="emoji">:indonesia:</span> | `indonesia` | <span class="emoji">:ireland:</span> | `ireland` |
| <span class="emoji">:israel:</span> | `israel` | <span class="emoji">:isle_of_man:</span> | `isle_of_man` |
| <span class="emoji">:india:</span> | `india` | <span class="emoji">:british_indian_ocean_territory:</span> | `british_indian_ocean_territory` |
| <span class="emoji">:iraq:</span> | `iraq` | <span class="emoji">:iran:</span> | `iran` |
| <span class="emoji">:iceland:</span> | `iceland` | <span class="emoji">:it:</span> | `it` |
| <span class="emoji">:jersey:</span> | `jersey` | <span class="emoji">:jamaica:</span> | `jamaica` |
| <span class="emoji">:jordan:</span> | `jordan` | <span class="emoji">:jp:</span> | `jp` |
| <span class="emoji">:kenya:</span> | `kenya` | <span class="emoji">:kyrgyzstan:</span> | `kyrgyzstan` |
| <span class="emoji">:cambodia:</span> | `cambodia` | <span class="emoji">:kiribati:</span> | `kiribati` |
| <span class="emoji">:comoros:</span> | `comoros` | <span class="emoji">:st_kitts_nevis:</span> | `st_kitts_nevis` |
| <span class="emoji">:north_korea:</span> | `north_korea` | <span class="emoji">:kr:</span> | `kr` |
| <span class="emoji">:kuwait:</span> | `kuwait` | <span class="emoji">:cayman_islands:</span> | `cayman_islands` |
| <span class="emoji">:kazakhstan:</span> | `kazakhstan` | <span class="emoji">:laos:</span> | `laos` |
| <span class="emoji">:lebanon:</span> | `lebanon` | <span class="emoji">:st_lucia:</span> | `st_lucia` |
| <span class="emoji">:liechtenstein:</span> | `liechtenstein` | <span class="emoji">:sri_lanka:</span> | `sri_lanka` |
| <span class="emoji">:liberia:</span> | `liberia` | <span class="emoji">:lesotho:</span> | `lesotho` |
| <span class="emoji">:lithuania:</span> | `lithuania` | <span class="emoji">:luxembourg:</span> | `luxembourg` |
| <span class="emoji">:latvia:</span> | `latvia` | <span class="emoji">:libya:</span> | `libya` |
| <span class="emoji">:morocco:</span> | `morocco` | <span class="emoji">:monaco:</span> | `monaco` |
| <span class="emoji">:moldova:</span> | `moldova` | <span class="emoji">:montenegro:</span> | `montenegro` |
| <span class="emoji">:madagascar:</span> | `madagascar` | <span class="emoji">:marshall_islands:</span> | `marshall_islands` |
| <span class="emoji">:macedonia:</span> | `macedonia` | <span class="emoji">:mali:</span> | `mali` |
| <span class="emoji">:myanmar:</span> | `myanmar` | <span class="emoji">:mongolia:</span> | `mongolia` |
| <span class="emoji">:macau:</span> | `macau` | <span class="emoji">:northern_mariana_islands:</span> | `northern_mariana_islands` |
| <span class="emoji">:martinique:</span> | `martinique` | <span class="emoji">:mauritania:</span> | `mauritania` |
| <span class="emoji">:montserrat:</span> | `montserrat` | <span class="emoji">:malta:</span> | `malta` |
| <span class="emoji">:mauritius:</span> | `mauritius` | <span class="emoji">:maldives:</span> | `maldives` |
| <span class="emoji">:malawi:</span> | `malawi` | <span class="emoji">:mexico:</span> | `mexico` |
| <span class="emoji">:malaysia:</span> | `malaysia` | <span class="emoji">:mozambique:</span> | `mozambique` |
| <span class="emoji">:namibia:</span> | `namibia` | <span class="emoji">:new_caledonia:</span> | `new_caledonia` |
| <span class="emoji">:niger:</span> | `niger` | <span class="emoji">:norfolk_island:</span> | `norfolk_island` |
| <span class="emoji">:nigeria:</span> | `nigeria` | <span class="emoji">:nicaragua:</span> | `nicaragua` |
| <span class="emoji">:netherlands:</span> | `netherlands` | <span class="emoji">:norway:</span> | `norway` |
| <span class="emoji">:nepal:</span> | `nepal` | <span class="emoji">:nauru:</span> | `nauru` |
| <span class="emoji">:niue:</span> | `niue` | <span class="emoji">:new_zealand:</span> | `new_zealand` |
| <span class="emoji">:oman:</span> | `oman` | <span class="emoji">:panama:</span> | `panama` |
| <span class="emoji">:peru:</span> | `peru` | <span class="emoji">:french_polynesia:</span> | `french_polynesia` |
| <span class="emoji">:papua_new_guinea:</span> | `papua_new_guinea` | <span class="emoji">:philippines:</span> | `philippines` |
| <span class="emoji">:pakistan:</span> | `pakistan` | <span class="emoji">:poland:</span> | `poland` |
| <span class="emoji">:st_pierre_miquelon:</span> | `st_pierre_miquelon` | <span class="emoji">:pitcairn_islands:</span> | `pitcairn_islands` |
| <span class="emoji">:puerto_rico:</span> | `puerto_rico` | <span class="emoji">:palestinian_territories:</span> | `palestinian_territories` |
| <span class="emoji">:portugal:</span> | `portugal` | <span class="emoji">:palau:</span> | `palau` |
| <span class="emoji">:paraguay:</span> | `paraguay` | <span class="emoji">:qatar:</span> | `qatar` |
| <span class="emoji">:reunion:</span> | `reunion` | <span class="emoji">:romania:</span> | `romania` |
| <span class="emoji">:serbia:</span> | `serbia` | <span class="emoji">:ru:</span> | `ru` |
| <span class="emoji">:rwanda:</span> | `rwanda` | <span class="emoji">:saudi_arabia:</span> | `saudi_arabia` |
| <span class="emoji">:solomon_islands:</span> | `solomon_islands` | <span class="emoji">:seychelles:</span> | `seychelles` |
| <span class="emoji">:sudan:</span> | `sudan` | <span class="emoji">:sweden:</span> | `sweden` |
| <span class="emoji">:singapore:</span> | `singapore` | <span class="emoji">:st_helena:</span> | `st_helena` |
| <span class="emoji">:slovenia:</span> | `slovenia` | <span class="emoji">:slovakia:</span> | `slovakia` |
| <span class="emoji">:sierra_leone:</span> | `sierra_leone` | <span class="emoji">:san_marino:</span> | `san_marino` |
| <span class="emoji">:senegal:</span> | `senegal` | <span class="emoji">:somalia:</span> | `somalia` |
| <span class="emoji">:suriname:</span> | `suriname` | <span class="emoji">:south_sudan:</span> | `south_sudan` |
| <span class="emoji">:sao_tome_principe:</span> | `sao_tome_principe` | <span class="emoji">:el_salvador:</span> | `el_salvador` |
| <span class="emoji">:sint_maarten:</span> | `sint_maarten` | <span class="emoji">:syria:</span> | `syria` |
| <span class="emoji">:swaziland:</span> | `swaziland` | <span class="emoji">:turks_caicos_islands:</span> | `turks_caicos_islands` |
| <span class="emoji">:chad:</span> | `chad` | <span class="emoji">:french_southern_territories:</span> | `french_southern_territories` |
| <span class="emoji">:togo:</span> | `togo` | <span class="emoji">:thailand:</span> | `thailand` |
| <span class="emoji">:tajikistan:</span> | `tajikistan` | <span class="emoji">:tokelau:</span> | `tokelau` |
| <span class="emoji">:timor_leste:</span> | `timor_leste` | <span class="emoji">:turkmenistan:</span> | `turkmenistan` |
| <span class="emoji">:tunisia:</span> | `tunisia` | <span class="emoji">:tonga:</span> | `tonga` |
| <span class="emoji">:tr:</span> | `tr` | <span class="emoji">:trinidad_tobago:</span> | `trinidad_tobago` |
| <span class="emoji">:tuvalu:</span> | `tuvalu` | <span class="emoji">:taiwan:</span> | `taiwan` |
| <span class="emoji">:tanzania:</span> | `tanzania` | <span class="emoji">:ukraine:</span> | `ukraine` |
| <span class="emoji">:uganda:</span> | `uganda` | <span class="emoji">:us:</span> | `us` |
| <span class="emoji">:uruguay:</span> | `uruguay` | <span class="emoji">:uzbekistan:</span> | `uzbekistan` |
| <span class="emoji">:vatican_city:</span> | `vatican_city` | <span class="emoji">:st_vincent_grenadines:</span> | `st_vincent_grenadines` |
| <span class="emoji">:venezuela:</span> | `venezuela` | <span class="emoji">:british_virgin_islands:</span> | `british_virgin_islands` |
| <span class="emoji">:us_virgin_islands:</span> | `us_virgin_islands` | <span class="emoji">:vietnam:</span> | `vietnam` |
| <span class="emoji">:vanuatu:</span> | `vanuatu` | <span class="emoji">:wallis_futuna:</span> | `wallis_futuna` |
| <span class="emoji">:samoa:</span> | `samoa` | <span class="emoji">:kosovo:</span> | `kosovo` |
| <span class="emoji">:yemen:</span> | `yemen` | <span class="emoji">:mayotte:</span> | `mayotte` |
| <span class="emoji">:south_africa:</span> | `south_africa` | <span class="emoji">:zambia:</span> | `zambia` |
| <span class="emoji">:zimbabwe:</span> | `zimbabwe` | | |

### GitHub Custom Emoji

| icon | code | icon | code |
| :-: | - | :-: | - |
| <span class="emoji">:atom:</span> | `atom` | <span class="emoji">:basecamp:</span> | `basecamp` |
| <span class="emoji">:basecampy:</span> | `basecampy` | <span class="emoji">:bowtie:</span> | `bowtie` |
| <span class="emoji">:electron:</span> | `electron` | <span class="emoji">:feelsgood:</span> | `feelsgood` |
| <span class="emoji">:finnadie:</span> | `finnadie` | <span class="emoji">:goberserk:</span> | `goberserk` |
| <span class="emoji">:godmode:</span> | `godmode` | <span class="emoji">:hurtrealbad:</span> | `hurtrealbad` |
| <span class="emoji">:neckbeard:</span> | `neckbeard` | <span class="emoji">:octocat:</span> | `octocat` |
| <span class="emoji">:rage1:</span> | `rage1` | <span class="emoji">:rage2:</span> | `rage2` |
| <span class="emoji">:rage3:</span> | `rage3` | <span class="emoji">:rage4:</span> | `rage4` |
| <span class="emoji">:shipit:</span> | `shipit` <br /> `squirrel` | <span class="emoji">:suspect:</span> | `suspect` |
| <span class="emoji">:trollface:</span> | `trollface` | | |

<style>
  .emoji {
    font-family: Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols;
  }
</style>
