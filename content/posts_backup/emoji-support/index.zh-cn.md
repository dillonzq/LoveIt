---
weight: 5
title: "Emoji 支持"
date: 2019-10-01T17:55:28+08:00
lastmod: 2019-10-01T17:55:28+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "Hugo 和 LoveIt 中的 Emoji 的用法指南."
images: []
resources:
- name: "featured-image"
  src: "featured-image.jpg"

tags: ["emoji"]
categories: ["Markdown"]

twemoji: false
lightgallery: true
---

Emoji 可以通过多种方式在 Hugo 项目中启用.

<!--more-->

[`emojify`](https://gohugo.io/functions/emojify/) 方法可以直接在模板中调用, 或者使用[行内 Shortcodes](https://gohugo.io/templates/shortcode-templates#inline-shortcodes).

要全局使用 emoji, 需要在你的[网站配置](https://gohugo.io/getting-started/configuration/)中设置 `enableEmoji` 为 `true`,
然后你就可以直接在文章中输入 emoji 的代码.

它们以**冒号**开头和结尾，并且包含 emoji 的 **代码**:

```markdown
去露营啦! {?:}tent: 很快就回来.

真开心! {?:}joy:
```

呈现的输出效果如下:

去露营啦! :tent: 很快就回来.

真开心! :joy:

以下**符号清单**是 emoji 代码的非常有用的参考.

## 表情与情感

### 笑脸表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :grinning: | `grinning` | :smiley: | `smiley` |
| :smile: | `smile` | :grin: | `grin` |
| :laughing: | `laughing` <br /> `satisfied` | :sweat_smile: | `sweat_smile` |
| :rofl: | `rofl` | :joy: | `joy` |
| :slightly_smiling_face: | `slightly_smiling_face` | :upside_down_face: | `upside_down_face` |
| :wink: | `wink` | :blush: | `blush` |
| :innocent: | `innocent` | | |

### 爱意表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :heart_eyes: | `heart_eyes` | :kissing_heart: | `kissing_heart` |
| :kissing: | `kissing` | :relaxed: | `relaxed` |
| :kissing_closed_eyes: | `kissing_closed_eyes` | :kissing_smiling_eyes: | `kissing_smiling_eyes` |

### 吐舌头表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :yum: | `yum` | :stuck_out_tongue: | `stuck_out_tongue` |
| :stuck_out_tongue_winking_eye: | `stuck_out_tongue_winking_eye` | :stuck_out_tongue_closed_eyes: | `stuck_out_tongue_closed_eyes` |
| :money_mouth_face: | `money_mouth_face` | | |

### 带手的表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :hugs: | `hugs` | :thinking: | `thinking` |

### 中性表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :zipper_mouth_face: | `zipper_mouth_face` | :neutral_face: | `neutral_face` |
| :expressionless: | `expressionless` | :no_mouth: | `no_mouth` |
| :smirk: | `smirk` | :unamused: | `unamused` |
| :roll_eyes: | `roll_eyes` | :grimacing: | `grimacing` |
| :lying_face: | `lying_face` | | |

### 困倦的表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :relieved: | `relieved` | :pensive: | `pensive` |
| :sleepy: | `sleepy` | :drooling_face: | `drooling_face` |
| :sleeping: | `sleeping` | | |

### 不适的表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :mask: | `mask` | :face_with_thermometer: | `face_with_thermometer` |
| :face_with_head_bandage: | `face_with_head_bandage` | :nauseated_face: | `nauseated_face` |
| :sneezing_face: | `sneezing_face` | :dizzy_face: | `dizzy_face` |

### 戴帽子的表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :cowboy_hat_face: | `cowboy_hat_face` | | |

### 戴眼镜的表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :sunglasses: | `sunglasses` | :nerd_face: | `nerd_face` |

### 担心的表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :confused: | `confused` | :worried: | `worried` |
| :slightly_frowning_face: | `slightly_frowning_face` | :frowning_face: | `frowning_face` |
| :open_mouth: | `open_mouth` | :hushed: | `hushed` |
| :astonished: | `astonished` | :flushed: | `flushed` |
| :frowning: | `frowning` | :anguished: | `anguished` |
| :fearful: | `fearful` | :cold_sweat: | `cold_sweat` |
| :disappointed_relieved: | `disappointed_relieved` | :cry: | `cry` |
| :sob: | `sob` | :scream: | `scream` |
| :confounded: | `confounded` | :persevere: | `persevere` |
| :disappointed: | `disappointed` | :sweat: | `sweat` |
| :weary: | `weary` | :tired_face: | `tired_face` |

### 否定的表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :triumph: | `triumph` | :pout: | `pout` <br /> `rage` |
| :angry: | `angry` | :smiling_imp: | `smiling_imp` |
| :imp: | `imp` | :skull: | `skull` |
| :skull_and_crossbones: | `skull_and_crossbones` | | |

### 特殊打扮的表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :hankey: | `hankey` <br /> `poop` <br /> `shit` | :clown_face: | `clown_face` |
| :japanese_ogre: | `japanese_ogre` | :japanese_goblin: | `japanese_goblin` |
| :ghost: | `ghost` | :alien: | `alien` |
| :space_invader: | `space_invader` | :robot: | `robot` |

### 猫脸表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :smiley_cat: | `smiley_cat` | :smile_cat: | `smile_cat` |
| :joy_cat: | `joy_cat` | :heart_eyes_cat: | `heart_eyes_cat` |
| :smirk_cat: | `smirk_cat` | :kissing_cat: | `kissing_cat` |
| :scream_cat: | `scream_cat` | :crying_cat_face: | `crying_cat_face` |
| :pouting_cat: | `pouting_cat` | | |

### 猴脸表情

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :see_no_evil: | `see_no_evil` | :hear_no_evil: | `hear_no_evil` |
| :speak_no_evil: | `speak_no_evil` | | |

### 情感

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :kiss: | `kiss` | :love_letter: | `love_letter` |
| :cupid: | `cupid` | :gift_heart: | `gift_heart` |
| :sparkling_heart: | `sparkling_heart` | :heartpulse: | `heartpulse` |
| :heartbeat: | `heartbeat` | :revolving_hearts: | `revolving_hearts` |
| :two_hearts: | `two_hearts` | :heart_decoration: | `heart_decoration` |
| :heavy_heart_exclamation: | `heavy_heart_exclamation` | :broken_heart: | `broken_heart` |
| :heart: | `heart` | :yellow_heart: | `yellow_heart` |
| :green_heart: | `green_heart` | :blue_heart: | `blue_heart` |
| :purple_heart: | `purple_heart` | :black_heart: | `black_heart` |
| :100: | `100` | :anger: | `anger` |
| :boom: | `boom` <br /> `collision` | :dizzy: | `dizzy` |
| :sweat_drops: | `sweat_drops` | :dash: | `dash` |
| :hole: | `hole` | :bomb: | `bomb` |
| :speech_balloon: | `speech_balloon` | :eye_speech_bubble: | `eye_speech_bubble` |
| :right_anger_bubble: | `right_anger_bubble` | :thought_balloon: | `thought_balloon` |
| :zzz: | `zzz` | | |

## 人与身体

### 张开手掌的手势

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :wave: | `wave` | :raised_back_of_hand: | `raised_back_of_hand` |
| :raised_hand_with_fingers_splayed: | `raised_hand_with_fingers_splayed` | :hand: | `hand` <br /> `raised_hand` |
| :vulcan_salute: | `vulcan_salute` | | |

### 部分手指的手势

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :ok_hand: | `ok_hand` | :v: | `v` |
| :crossed_fingers: | `crossed_fingers` | :metal: | `metal` |
| :call_me_hand: | `call_me_hand` | | |

### 一根手指的手势

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :point_left: | `point_left` | :point_right: | `point_right` |
| :point_up_2: | `point_up_2` | :fu: | `fu` <br /> `middle_finger` |
| :point_down: | `point_down` | :point_up: | `point_up` |

### 握紧的手势

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :+1: | `+1` <br /> `thumbsup` | :-1: | `-1` <br /> `thumbsdown` |
| :fist: | `fist` <br /> `fist_raised` | :facepunch: | `facepunch` <br /> `fist_oncoming` <br /> `punch` |
| :fist_left: | `fist_left` | :fist_right: | `fist_right` |

### 两只手

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :clap: | `clap` | :raised_hands: | `raised_hands` |
| :open_hands: | `open_hands` | :handshake: | `handshake` |
| :pray: | `pray` | | |

### 握住东西的手势

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :writing_hand: | `writing_hand` | :nail_care: | `nail_care` |
| :selfie: | `selfie` | | |

### 身体部位

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :muscle: | `muscle` | :ear: | `ear` |
| :nose: | `nose` | :eyes: | `eyes` |
| :eye: | `eye` | :tongue: | `tongue` |
| :lips: | `lips` | | |

### 人

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :baby: | `baby` | :boy: | `boy` |
| :girl: | `girl` | :blonde_man: | `blonde_man` <br /> `person_with_blond_hair` |
| :man: | `man` | :woman: | `woman` |
| :blonde_woman: | `blonde_woman` | :older_man: | `older_man` |
| :older_woman: | `older_woman` | | |

### 身体动作

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :frowning_woman: | `frowning_woman` <br /> `person_frowning` | :frowning_man: | `frowning_man` |
| :person_with_pouting_face: | `person_with_pouting_face` <br /> `pouting_woman` | :pouting_man: | `pouting_man` |
| :ng_woman: | `ng_woman` <br /> `no_good` <br /> `no_good_woman` | :ng_man: | `ng_man` <br /> `no_good_man` |
| :ok_woman: | `ok_woman` | :ok_man: | `ok_man` |
| :information_desk_person: | `information_desk_person` <br /> `sassy_woman` <br /> `tipping_hand_woman` | :sassy_man: | `sassy_man` <br /> `tipping_hand_man` |
| :raising_hand: | `raising_hand` <br /> `raising_hand_woman` | :raising_hand_man: | `raising_hand_man` |
| :bow: | `bow` <br /> `bowing_man` | :bowing_woman: | `bowing_woman` |
| :man_facepalming: | `man_facepalming` | :woman_facepalming: | `woman_facepalming` |
| :man_shrugging: | `man_shrugging` | :woman_shrugging: | `woman_shrugging` |

### 人物角色

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :man_health_worker: | `man_health_worker` | :woman_health_worker: | `woman_health_worker` |
| :man_student: | `man_student` | :woman_student: | `woman_student` |
| :man_teacher: | `man_teacher` | :woman_teacher: | `woman_teacher` |
| :man_judge: | `man_judge` | :woman_judge: | `woman_judge` |
| :man_farmer: | `man_farmer` | :woman_farmer: | `woman_farmer` |
| :man_cook: | `man_cook` | :woman_cook: | `woman_cook` |
| :man_mechanic: | `man_mechanic` | :woman_mechanic: | `woman_mechanic` |
| :man_factory_worker: | `man_factory_worker` | :woman_factory_worker: | `woman_factory_worker` |
| :man_office_worker: | `man_office_worker` | :woman_office_worker: | `woman_office_worker` |
| :man_scientist: | `man_scientist` | :woman_scientist: | `woman_scientist` |
| :man_technologist: | `man_technologist` | :woman_technologist: | `woman_technologist` |
| :man_singer: | `man_singer` | :woman_singer: | `woman_singer` |
| :man_artist: | `man_artist` | :woman_artist: | `woman_artist` |
| :man_pilot: | `man_pilot` | :woman_pilot: | `woman_pilot` |
| :man_astronaut: | `man_astronaut` | :woman_astronaut: | `woman_astronaut` |
| :man_firefighter: | `man_firefighter` | :woman_firefighter: | `woman_firefighter` |
| :cop: | `cop` <br /> `policeman` | :policewoman: | `policewoman` |
| :detective: | `detective` <br /> `male_detective` | :female_detective: | `female_detective` |
| :guardsman: | `guardsman` | :guardswoman: | `guardswoman` |
| :construction_worker: | `construction_worker` <br /> `construction_worker_man` | :construction_worker_woman: | `construction_worker_woman` |
| :prince: | `prince` | :princess: | `princess` |
| :man_with_turban: | `man_with_turban` | :woman_with_turban: | `woman_with_turban` |
| :man_with_gua_pi_mao: | `man_with_gua_pi_mao` | :man_in_tuxedo: | `man_in_tuxedo` |
| :bride_with_veil: | `bride_with_veil` | :pregnant_woman: | `pregnant_woman` |

### 幻想的人物

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :angel: | `angel` | :santa: | `santa` |
| :mrs_claus: | `mrs_claus` | | |

### 人物活动

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :massage: | `massage` <br /> `massage_woman` | :massage_man: | `massage_man` |
| :haircut: | `haircut` <br /> `haircut_woman` | :haircut_man: | `haircut_man` |
| :walking: | `walking` <br /> `walking_man` | :walking_woman: | `walking_woman` |
| :runner: | `runner` <br /> `running` <br /> `running_man` | :running_woman: | `running_woman` |
| :dancer: | `dancer` | :man_dancing: | `man_dancing` |
| :business_suit_levitating: | `business_suit_levitating` | :dancers: | `dancers` <br /> `dancing_women` |
| :dancing_men: | `dancing_men` | | |

### 体育

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :person_fencing: | `person_fencing` | :horse_racing: | `horse_racing` |
| :skier: | `skier` | :snowboarder: | `snowboarder` |
| :golfing_man: | `golfing_man` | :golfing_woman: | `golfing_woman` |
| :surfer: | `surfer` <br /> `surfing_man` | :surfing_woman: | `surfing_woman` |
| :rowboat: | `rowboat` <br /> `rowing_man` | :rowing_woman: | `rowing_woman` |
| :swimmer: | `swimmer` <br /> `swimming_man` | :swimming_woman: | `swimming_woman` |
| :basketball_man: | `basketball_man` | :basketball_woman: | `basketball_woman` |
| :weight_lifting_man: | `weight_lifting_man` | :weight_lifting_woman: | `weight_lifting_woman` |
| :bicyclist: | `bicyclist` <br /> `biking_man` | :biking_woman: | `biking_woman` |
| :mountain_bicyclist: | `mountain_bicyclist` <br /> `mountain_biking_man` | :mountain_biking_woman: | `mountain_biking_woman` |
| :man_cartwheeling: | `man_cartwheeling` | :woman_cartwheeling: | `woman_cartwheeling` |
| :men_wrestling: | `men_wrestling` | :women_wrestling: | `women_wrestling` |
| :man_playing_water_polo: | `man_playing_water_polo` | :woman_playing_water_polo: | `woman_playing_water_polo` |
| :man_playing_handball: | `man_playing_handball` | :woman_playing_handball: | `woman_playing_handball` |
| :man_juggling: | `man_juggling` | :woman_juggling: | `woman_juggling` |

### 休息

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :bath: | `bath` | :sleeping_bed: | `sleeping_bed` |

### 家庭

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :two_women_holding_hands: | `two_women_holding_hands` | :couple: | `couple` |
| :two_men_holding_hands: | `two_men_holding_hands` | :couplekiss_man_woman: | `couplekiss_man_woman` |
| :couplekiss_man_man: | `couplekiss_man_man` | :couplekiss_woman_woman: | `couplekiss_woman_woman` |
| :couple_with_heart: | `couple_with_heart` <br /> `couple_with_heart_woman_man` | :couple_with_heart_man_man: | `couple_with_heart_man_man` |
| :couple_with_heart_woman_woman: | `couple_with_heart_woman_woman` | :family: | `family` <br /> `family_man_woman_boy` |
| :family_man_woman_girl: | `family_man_woman_girl` | :family_man_woman_girl_boy: | `family_man_woman_girl_boy` |
| :family_man_woman_boy_boy: | `family_man_woman_boy_boy` | :family_man_woman_girl_girl: | `family_man_woman_girl_girl` |
| :family_man_man_boy: | `family_man_man_boy` | :family_man_man_girl: | `family_man_man_girl` |
| :family_man_man_girl_boy: | `family_man_man_girl_boy` | :family_man_man_boy_boy: | `family_man_man_boy_boy` |
| :family_man_man_girl_girl: | `family_man_man_girl_girl` | :family_woman_woman_boy: | `family_woman_woman_boy` |
| :family_woman_woman_girl: | `family_woman_woman_girl` | :family_woman_woman_girl_boy: | `family_woman_woman_girl_boy` |
| :family_woman_woman_boy_boy: | `family_woman_woman_boy_boy` | :family_woman_woman_girl_girl: | `family_woman_woman_girl_girl` |
| :family_man_boy: | `family_man_boy` | :family_man_boy_boy: | `family_man_boy_boy` |
| :family_man_girl: | `family_man_girl` | :family_man_girl_boy: | `family_man_girl_boy` |
| :family_man_girl_girl: | `family_man_girl_girl` | :family_woman_boy: | `family_woman_boy` |
| :family_woman_boy_boy: | `family_woman_boy_boy` | :family_woman_girl: | `family_woman_girl` |
| :family_woman_girl_boy: | `family_woman_girl_boy` | :family_woman_girl_girl: | `family_woman_girl_girl` |

### 人物符号

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :speaking_head: | `speaking_head` | :bust_in_silhouette: | `bust_in_silhouette` |
| :busts_in_silhouette: | `busts_in_silhouette` | :footprints: | `footprints` |

## 动物与自然

### 哺乳动物

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :monkey_face: | `monkey_face` | :monkey: | `monkey` |
| :gorilla: | `gorilla` | :dog: | `dog` |
| :dog2: | `dog2` | :poodle: | `poodle` |
| :wolf: | `wolf` | :fox_face: | `fox_face` |
| :cat: | `cat` | :cat2: | `cat2` |
| :lion: | `lion` | :tiger: | `tiger` |
| :tiger2: | `tiger2` | :leopard: | `leopard` |
| :horse: | `horse` | :racehorse: | `racehorse` |
| :unicorn: | `unicorn` | :deer: | `deer` |
| :cow: | `cow` | :ox: | `ox` |
| :water_buffalo: | `water_buffalo` | :cow2: | `cow2` |
| :pig: | `pig` | :pig2: | `pig2` |
| :boar: | `boar` | :pig_nose: | `pig_nose` |
| :ram: | `ram` | :sheep: | `sheep` |
| :goat: | `goat` | :dromedary_camel: | `dromedary_camel` |
| :camel: | `camel` | :elephant: | `elephant` |
| :rhinoceros: | `rhinoceros` | :mouse: | `mouse` |
| :mouse2: | `mouse2` | :rat: | `rat` |
| :hamster: | `hamster` | :rabbit: | `rabbit` |
| :rabbit2: | `rabbit2` | :chipmunk: | `chipmunk` |
| :bat: | `bat` | :bear: | `bear` |
| :koala: | `koala` | :panda_face: | `panda_face` |
| :feet: | `feet` <br /> `paw_prints` | | |

### 鸟类

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :turkey: | `turkey` | :chicken: | `chicken` |
| :rooster: | `rooster` | :hatching_chick: | `hatching_chick` |
| :baby_chick: | `baby_chick` | :hatched_chick: | `hatched_chick` |
| :bird: | `bird` | :penguin: | `penguin` |
| :dove: | `dove` | :eagle: | `eagle` |
| :duck: | `duck` | :owl: | `owl` |

### 两栖动物

| icon | code | icon | code |
| :-: | - | :-: | - |
| :frog: | `frog` |

### 爬虫类

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :crocodile: | `crocodile` | :turtle: | `turtle` |
| :lizard: | `lizard` | :snake: | `snake` |
| :dragon_face: | `dragon_face` | :dragon: | `dragon` |

### 海洋动物

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :whale: | `whale` | :whale2: | `whale2` |
| :dolphin: | `dolphin` <br /> `flipper` | :fish: | `fish` |
| :tropical_fish: | `tropical_fish` | :blowfish: | `blowfish` |
| :shark: | `shark` | :octopus: | `octopus` |
| :shell: | `shell` | | |

### 虫类

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :snail: | `snail` | :butterfly: | `butterfly` |
| :bug: | `bug` | :ant: | `ant` |
| :bee: | `bee` <br /> `honeybee` | :beetle: | `beetle` |
| :spider: | `spider` | :spider_web: | `spider_web` |
| :scorpion: | `scorpion` | | |

### 花类植物

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :bouquet: | `bouquet` | :cherry_blossom: | `cherry_blossom` |
| :white_flower: | `white_flower` | :rosette: | `rosette` |
| :rose: | `rose` | :wilted_flower: | `wilted_flower` |
| :hibiscus: | `hibiscus` | :sunflower: | `sunflower` |
| :blossom: | `blossom` | :tulip: | `tulip` |

### 其它植物

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :seedling: | `seedling` | :evergreen_tree: | `evergreen_tree` |
| :deciduous_tree: | `deciduous_tree` | :palm_tree: | `palm_tree` |
| :cactus: | `cactus` | :ear_of_rice: | `ear_of_rice` |
| :herb: | `herb` | :shamrock: | `shamrock` |
| :four_leaf_clover: | `four_leaf_clover` | :maple_leaf: | `maple_leaf` |
| :fallen_leaf: | `fallen_leaf` | :leaves: | `leaves` |

## 食物与饮料

### 水果

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :grapes: | `grapes` | :melon: | `melon` |
| :watermelon: | `watermelon` | :mandarin: | `mandarin` <br /> `orange` <br /> `tangerine` |
| :lemon: | `lemon` | :banana: | `banana` |
| :pineapple: | `pineapple` | :apple: | `apple` |
| :green_apple: | `green_apple` | :pear: | `pear` |
| :peach: | `peach` | :cherries: | `cherries` |
| :strawberry: | `strawberry` | :kiwi_fruit: | `kiwi_fruit` |
| :tomato: | `tomato` | | |

### 蔬菜

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :avocado: | `avocado` | :eggplant: | `eggplant` |
| :potato: | `potato` | :carrot: | `carrot` |
| :corn: | `corn` | :hot_pepper: | `hot_pepper` |
| :cucumber: | `cucumber` | :mushroom: | `mushroom` |
| :peanuts: | `peanuts` | :chestnut: | `chestnut` |

### 快餐

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :bread: | `bread` | :croissant: | `croissant` |
| :baguette_bread: | `baguette_bread` | :pancakes: | `pancakes` |
| :cheese: | `cheese` | :meat_on_bone: | `meat_on_bone` |
| :poultry_leg: | `poultry_leg` | :bacon: | `bacon` |
| :hamburger: | `hamburger` | :fries: | `fries` |
| :pizza: | `pizza` | :hotdog: | `hotdog` |
| :taco: | `taco` | :burrito: | `burrito` |
| :stuffed_flatbread: | `stuffed_flatbread` | :egg: | `egg` |
| :fried_egg: | `fried_egg` | :shallow_pan_of_food: | `shallow_pan_of_food` |
| :stew: | `stew` | :green_salad: | `green_salad` |
| :popcorn: | `popcorn` | | |

### 亚洲食物

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :bento: | `bento` | :rice_cracker: | `rice_cracker` |
| :rice_ball: | `rice_ball` | :rice: | `rice` |
| :curry: | `curry` | :ramen: | `ramen` |
| :spaghetti: | `spaghetti` | :sweet_potato: | `sweet_potato` |
| :oden: | `oden` | :sushi: | `sushi` |
| :fried_shrimp: | `fried_shrimp` | :fish_cake: | `fish_cake` |
| :dango: | `dango` | | |

### 海鲜

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :crab: | `crab` | :shrimp: | `shrimp` |
| :squid: | `squid` | | |

### 甜点

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :icecream: | `icecream` | :shaved_ice: | `shaved_ice` |
| :ice_cream: | `ice_cream` | :doughnut: | `doughnut` |
| :cookie: | `cookie` | :birthday: | `birthday` |
| :cake: | `cake` | :chocolate_bar: | `chocolate_bar` |
| :candy: | `candy` | :lollipop: | `lollipop` |
| :custard: | `custard` | :honey_pot: | `honey_pot` |

### 饮料

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :baby_bottle: | `baby_bottle` | :milk_glass: | `milk_glass` |
| :coffee: | `coffee` | :tea: | `tea` |
| :sake: | `sake` | :champagne: | `champagne` |
| :wine_glass: | `wine_glass` | :cocktail: | `cocktail` |
| :tropical_drink: | `tropical_drink` | :beer: | `beer` |
| :beers: | `beers` | :clinking_glasses: | `clinking_glasses` |
| :tumbler_glass: | `tumbler_glass` | | |

### 餐具

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :plate_with_cutlery: | `plate_with_cutlery` | :fork_and_knife: | `fork_and_knife` |
| :spoon: | `spoon` | :hocho: | `hocho` <br /> `knife` |
| :amphora: | `amphora` | | |

## 旅游与地理

### 地图

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :earth_africa: | `earth_africa` | :earth_americas: | `earth_americas` |
| :earth_asia: | `earth_asia` | :globe_with_meridians: | `globe_with_meridians` |
| :world_map: | `world_map` | :japan: | `japan` |

### 地理现象

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :mountain_snow: | `mountain_snow` | :mountain: | `mountain` |
| :volcano: | `volcano` | :mount_fuji: | `mount_fuji` |
| :camping: | `camping` | :beach_umbrella: | `beach_umbrella` |
| :desert: | `desert` | :desert_island: | `desert_island` |
| :national_park: | `national_park` | | |

### 建筑物

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :stadium: | `stadium` | :classical_building: | `classical_building` |
| :building_construction: | `building_construction` | :houses: | `houses` |
| :derelict_house: | `derelict_house` | :house: | `house` |
| :house_with_garden: | `house_with_garden` | :office: | `office` |
| :post_office: | `post_office` | :european_post_office: | `european_post_office` |
| :hospital: | `hospital` | :bank: | `bank` |
| :hotel: | `hotel` | :love_hotel: | `love_hotel` |
| :convenience_store: | `convenience_store` | :school: | `school` |
| :department_store: | `department_store` | :factory: | `factory` |
| :japanese_castle: | `japanese_castle` | :european_castle: | `european_castle` |
| :wedding: | `wedding` | :tokyo_tower: | `tokyo_tower` |
| :statue_of_liberty: | `statue_of_liberty` | | |

### 宗教建筑

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :church: | `church` | :mosque: | `mosque` |
| :synagogue: | `synagogue` | :shinto_shrine: | `shinto_shrine` |
| :kaaba: | `kaaba` | | |

### 其它地点

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :fountain: | `fountain` | :tent: | `tent` |
| :foggy: | `foggy` | :night_with_stars: | `night_with_stars` |
| :cityscape: | `cityscape` | :sunrise_over_mountains: | `sunrise_over_mountains` |
| :sunrise: | `sunrise` | :city_sunset: | `city_sunset` |
| :city_sunrise: | `city_sunrise` | :bridge_at_night: | `bridge_at_night` |
| :hotsprings: | `hotsprings` | :carousel_horse: | `carousel_horse` |
| :ferris_wheel: | `ferris_wheel` | :roller_coaster: | `roller_coaster` |
| :barber: | `barber` | :circus_tent: | `circus_tent` |

### 陆路运输

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :steam_locomotive: | `steam_locomotive` | :railway_car: | `railway_car` |
| :bullettrain_side: | `bullettrain_side` | :bullettrain_front: | `bullettrain_front` |
| :train2: | `train2` | :metro: | `metro` |
| :light_rail: | `light_rail` | :station: | `station` |
| :tram: | `tram` | :monorail: | `monorail` |
| :mountain_railway: | `mountain_railway` | :train: | `train` |
| :bus: | `bus` | :oncoming_bus: | `oncoming_bus` |
| :trolleybus: | `trolleybus` | :minibus: | `minibus` |
| :ambulance: | `ambulance` | :fire_engine: | `fire_engine` |
| :police_car: | `police_car` | :oncoming_police_car: | `oncoming_police_car` |
| :taxi: | `taxi` | :oncoming_taxi: | `oncoming_taxi` |
| :car: | `car` <br /> `red_car` | :oncoming_automobile: | `oncoming_automobile` |
| :blue_car: | `blue_car` | :truck: | `truck` |
| :articulated_lorry: | `articulated_lorry` | :tractor: | `tractor` |
| :racing_car: | `racing_car` | :motorcycle: | `motorcycle` |
| :motor_scooter: | `motor_scooter` | :bike: | `bike` |
| :kick_scooter: | `kick_scooter` | :busstop: | `busstop` |
| :motorway: | `motorway` | :railway_track: | `railway_track` |
| :oil_drum: | `oil_drum` | :fuelpump: | `fuelpump` |
| :rotating_light: | `rotating_light` | :traffic_light: | `traffic_light` |
| :vertical_traffic_light: | `vertical_traffic_light` | :stop_sign: | `stop_sign` |
| :construction: | `construction` | | |

### 水路运输

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :anchor: | `anchor` | :boat: | `boat` <br /> `sailboat` |
| :canoe: | `canoe` | :speedboat: | `speedboat` |
| :passenger_ship: | `passenger_ship` | :ferry: | `ferry` |
| :motor_boat: | `motor_boat` | :ship: | `ship` |

### 空中运输

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :airplane: | `airplane` | :small_airplane: | `small_airplane` |
| :flight_departure: | `flight_departure` | :flight_arrival: | `flight_arrival` |
| :seat: | `seat` | :helicopter: | `helicopter` |
| :suspension_railway: | `suspension_railway` | :mountain_cableway: | `mountain_cableway` |
| :aerial_tramway: | `aerial_tramway` | :artificial_satellite: | `artificial_satellite` |
| :rocket: | `rocket` | | |

### 旅馆

| icon | code | icon | code |
| :-: | - | :-: | - |
| :bellhop_bell: | `bellhop_bell` |

### 时间

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :hourglass: | `hourglass` | :hourglass_flowing_sand: | `hourglass_flowing_sand` |
| :watch: | `watch` | :alarm_clock: | `alarm_clock` |
| :stopwatch: | `stopwatch` | :timer_clock: | `timer_clock` |
| :mantelpiece_clock: | `mantelpiece_clock` | :clock12: | `clock12` |
| :clock1230: | `clock1230` | :clock1: | `clock1` |
| :clock130: | `clock130` | :clock2: | `clock2` |
| :clock230: | `clock230` | :clock3: | `clock3` |
| :clock330: | `clock330` | :clock4: | `clock4` |
| :clock430: | `clock430` | :clock5: | `clock5` |
| :clock530: | `clock530` | :clock6: | `clock6` |
| :clock630: | `clock630` | :clock7: | `clock7` |
| :clock730: | `clock730` | :clock8: | `clock8` |
| :clock830: | `clock830` | :clock9: | `clock9` |
| :clock930: | `clock930` | :clock10: | `clock10` |
| :clock1030: | `clock1030` | :clock11: | `clock11` |
| :clock1130: | `clock1130` | | |

### 天空与天气

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :new_moon: | `new_moon` | :waxing_crescent_moon: | `waxing_crescent_moon` |
| :first_quarter_moon: | `first_quarter_moon` | :moon: | `moon` <br /> `waxing_gibbous_moon` |
| :full_moon: | `full_moon` | :waning_gibbous_moon: | `waning_gibbous_moon` |
| :last_quarter_moon: | `last_quarter_moon` | :waning_crescent_moon: | `waning_crescent_moon` |
| :crescent_moon: | `crescent_moon` | :new_moon_with_face: | `new_moon_with_face` |
| :first_quarter_moon_with_face: | `first_quarter_moon_with_face` | :last_quarter_moon_with_face: | `last_quarter_moon_with_face` |
| :thermometer: | `thermometer` | :sunny: | `sunny` |
| :full_moon_with_face: | `full_moon_with_face` | :sun_with_face: | `sun_with_face` |
| :star: | `star` | :star2: | `star2` |
| :stars: | `stars` | :milky_way: | `milky_way` |
| :cloud: | `cloud` | :partly_sunny: | `partly_sunny` |
| :cloud_with_lightning_and_rain: | `cloud_with_lightning_and_rain` | :sun_behind_small_cloud: | `sun_behind_small_cloud` |
| :sun_behind_large_cloud: | `sun_behind_large_cloud` | :sun_behind_rain_cloud: | `sun_behind_rain_cloud` |
| :cloud_with_rain: | `cloud_with_rain` | :cloud_with_snow: | `cloud_with_snow` |
| :cloud_with_lightning: | `cloud_with_lightning` | :tornado: | `tornado` |
| :fog: | `fog` | :wind_face: | `wind_face` |
| :cyclone: | `cyclone` | :rainbow: | `rainbow` |
| :closed_umbrella: | `closed_umbrella` | :open_umbrella: | `open_umbrella` |
| :umbrella: | `umbrella` | :parasol_on_ground: | `parasol_on_ground` |
| :zap: | `zap` | :snowflake: | `snowflake` |
| :snowman_with_snow: | `snowman_with_snow` | :snowman: | `snowman` |
| :comet: | `comet` | :fire: | `fire` |
| :droplet: | `droplet` | :ocean: | `ocean` |

## 活动

### 事件

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :jack_o_lantern: | `jack_o_lantern` | :christmas_tree: | `christmas_tree` |
| :fireworks: | `fireworks` | :sparkler: | `sparkler` |
| :sparkles: | `sparkles` | :balloon: | `balloon` |
| :tada: | `tada` | :confetti_ball: | `confetti_ball` |
| :tanabata_tree: | `tanabata_tree` | :bamboo: | `bamboo` |
| :dolls: | `dolls` | :flags: | `flags` |
| :wind_chime: | `wind_chime` | :rice_scene: | `rice_scene` |
| :ribbon: | `ribbon` | :gift: | `gift` |
| :reminder_ribbon: | `reminder_ribbon` | :tickets: | `tickets` |
| :ticket: | `ticket` | | |

### 奖杯与奖牌

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :medal_military: | `medal_military` | :trophy: | `trophy` |
| :medal_sports: | `medal_sports` | :1st_place_medal: | `1st_place_medal` |
| :2nd_place_medal: | `2nd_place_medal` | :3rd_place_medal: | `3rd_place_medal` |

### 体育运动

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :soccer: | `soccer` | :baseball: | `baseball` |
| :basketball: | `basketball` | :volleyball: | `volleyball` |
| :football: | `football` | :rugby_football: | `rugby_football` |
| :tennis: | `tennis` | :bowling: | `bowling` |
| :cricket: | `cricket` | :field_hockey: | `field_hockey` |
| :ice_hockey: | `ice_hockey` | :ping_pong: | `ping_pong` |
| :badminton: | `badminton` | :boxing_glove: | `boxing_glove` |
| :martial_arts_uniform: | `martial_arts_uniform` | :goal_net: | `goal_net` |
| :golf: | `golf` | :ice_skate: | `ice_skate` |
| :fishing_pole_and_fish: | `fishing_pole_and_fish` | :running_shirt_with_sash: | `running_shirt_with_sash` |
| :ski: | `ski` | | |

### 游戏

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :dart: | `dart` | :8ball: | `8ball` |
| :crystal_ball: | `crystal_ball` | :video_game: | `video_game` |
| :joystick: | `joystick` | :slot_machine: | `slot_machine` |
| :game_die: | `game_die` | :spades: | `spades` |
| :hearts: | `hearts` | :diamonds: | `diamonds` |
| :clubs: | `clubs` | :black_joker: | `black_joker` |
| :mahjong: | `mahjong` | :flower_playing_cards: | `flower_playing_cards` |

### 艺术与工艺

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :performing_arts: | `performing_arts` | :framed_picture: | `framed_picture` |
| :art: | `art` | | |

## 物品

### 服装

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :eyeglasses: | `eyeglasses` | :dark_sunglasses: | `dark_sunglasses` |
| :necktie: | `necktie` | :shirt: | `shirt` <br /> `tshirt` |
| :jeans: | `jeans` | :dress: | `dress` |
| :kimono: | `kimono` | :bikini: | `bikini` |
| :womans_clothes: | `womans_clothes` | :purse: | `purse` |
| :handbag: | `handbag` | :pouch: | `pouch` |
| :shopping: | `shopping` | :school_satchel: | `school_satchel` |
| :mans_shoe: | `mans_shoe` <br /> `shoe` | :athletic_shoe: | `athletic_shoe` |
| :high_heel: | `high_heel` | :sandal: | `sandal` |
| :boot: | `boot` | :crown: | `crown` |
| :womans_hat: | `womans_hat` | :tophat: | `tophat` |
| :mortar_board: | `mortar_board` | :rescue_worker_helmet: | `rescue_worker_helmet` |
| :prayer_beads: | `prayer_beads` | :lipstick: | `lipstick` |
| :ring: | `ring` | :gem: | `gem` |

### 声音

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :mute: | `mute` | :speaker: | `speaker` |
| :sound: | `sound` | :loud_sound: | `loud_sound` |
| :loudspeaker: | `loudspeaker` | :mega: | `mega` |
| :postal_horn: | `postal_horn` | :bell: | `bell` |
| :no_bell: | `no_bell` | | |

### 音乐

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :musical_score: | `musical_score` | :musical_note: | `musical_note` |
| :notes: | `notes` | :studio_microphone: | `studio_microphone` |
| :level_slider: | `level_slider` | :control_knobs: | `control_knobs` |
| :microphone: | `microphone` | :headphones: | `headphones` |
| :radio: | `radio` | | |

### 乐器

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :saxophone: | `saxophone` | :guitar: | `guitar` |
| :musical_keyboard: | `musical_keyboard` | :trumpet: | `trumpet` |
| :violin: | `violin` | :drum: | `drum` |

### 电话

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :iphone: | `iphone` | :calling: | `calling` |
| :phone: | `phone` <br /> `telephone` | :telephone_receiver: | `telephone_receiver` |
| :pager: | `pager` | :fax: | `fax` |

### 电脑

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :battery: | `battery` | :electric_plug: | `electric_plug` |
| :computer: | `computer` | :desktop_computer: | `desktop_computer` |
| :printer: | `printer` | :keyboard: | `keyboard` |
| :computer_mouse: | `computer_mouse` | :trackball: | `trackball` |
| :minidisc: | `minidisc` | :floppy_disk: | `floppy_disk` |
| :cd: | `cd` | :dvd: | `dvd` |

### 灯光与影像

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :movie_camera: | `movie_camera` | :film_strip: | `film_strip` |
| :film_projector: | `film_projector` | :clapper: | `clapper` |
| :tv: | `tv` | :camera: | `camera` |
| :camera_flash: | `camera_flash` | :video_camera: | `video_camera` |
| :vhs: | `vhs` | :mag: | `mag` |
| :mag_right: | `mag_right` | :candle: | `candle` |
| :bulb: | `bulb` | :flashlight: | `flashlight` |
| :izakaya_lantern: | `izakaya_lantern` <br /> `lantern` | | |

### 书与纸张

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :notebook_with_decorative_cover: | `notebook_with_decorative_cover` | :closed_book: | `closed_book` |
| :book: | `book` <br /> `open_book` | :green_book: | `green_book` |
| :blue_book: | `blue_book` | :orange_book: | `orange_book` |
| :books: | `books` | :notebook: | `notebook` |
| :ledger: | `ledger` | :page_with_curl: | `page_with_curl` |
| :scroll: | `scroll` | :page_facing_up: | `page_facing_up` |
| :newspaper: | `newspaper` | :newspaper_roll: | `newspaper_roll` |
| :bookmark_tabs: | `bookmark_tabs` | :bookmark: | `bookmark` |
| :label: | `label` | | |

### 钱

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :moneybag: | `moneybag` | :yen: | `yen` |
| :dollar: | `dollar` | :euro: | `euro` |
| :pound: | `pound` | :money_with_wings: | `money_with_wings` |
| :credit_card: | `credit_card` | :chart: | `chart` |

### 邮件

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :email: | `email` <br /> `envelope` | :e-mail: | `:e-mail:` |
| :incoming_envelope: | `incoming_envelope` | :envelope_with_arrow: | `envelope_with_arrow` |
| :outbox_tray: | `outbox_tray` | :inbox_tray: | `inbox_tray` |
| :package: | `package` | :mailbox: | `mailbox` |
| :mailbox_closed: | `mailbox_closed` | :mailbox_with_mail: | `mailbox_with_mail` |
| :mailbox_with_no_mail: | `mailbox_with_no_mail` | :postbox: | `postbox` |
| :ballot_box: | `ballot_box` | | |

### 书写

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :pencil2: | `pencil2` | :black_nib: | `black_nib` |
| :fountain_pen: | `fountain_pen` | :pen: | `pen` |
| :paintbrush: | `paintbrush` | :crayon: | `crayon` |
| :memo: | `memo` <br /> `pencil` | | |

### 办公

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :briefcase: | `briefcase` | :file_folder: | `file_folder` |
| :open_file_folder: | `open_file_folder` | :card_index_dividers: | `card_index_dividers` |
| :date: | `date` | :calendar: | `calendar` |
| :spiral_notepad: | `spiral_notepad` | :spiral_calendar: | `spiral_calendar` |
| :card_index: | `card_index` | :chart_with_upwards_trend: | `chart_with_upwards_trend` |
| :chart_with_downwards_trend: | `chart_with_downwards_trend` | :bar_chart: | `bar_chart` |
| :clipboard: | `clipboard` | :pushpin: | `pushpin` |
| :round_pushpin: | `round_pushpin` | :paperclip: | `paperclip` |
| :paperclips: | `paperclips` | :straight_ruler: | `straight_ruler` |
| :triangular_ruler: | `triangular_ruler` | :scissors: | `scissors` |
| :card_file_box: | `card_file_box` | :file_cabinet: | `file_cabinet` |
| :wastebasket: | `wastebasket` | | |

### 锁

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :lock: | `lock` | :unlock: | `unlock` |
| :lock_with_ink_pen: | `lock_with_ink_pen` | :closed_lock_with_key: | `closed_lock_with_key` |
| :key: | `key` | :old_key: | `old_key` |

### 工具

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :hammer: | `hammer` | :pick: | `pick` |
| :hammer_and_pick: | `hammer_and_pick` | :hammer_and_wrench: | `hammer_and_wrench` |
| :dagger: | `dagger` | :crossed_swords: | `crossed_swords` |
| :gun: | `gun` | :bow_and_arrow: | `bow_and_arrow` |
| :shield: | `shield` | :wrench: | `wrench` |
| :nut_and_bolt: | `nut_and_bolt` | :gear: | `gear` |
| :clamp: | `clamp` | :balance_scale: | `balance_scale` |
| :link: | `link` | :chains: | `chains` |

### 科学

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :alembic: | `alembic` | :microscope: | `microscope` |
| :telescope: | `telescope` | :satellite: | `satellite` |

### 医疗

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :syringe: | `syringe` | :pill: | `pill` |

### 生活用品

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :door: | `door` | :bed: | `bed` |
| :couch_and_lamp: | `couch_and_lamp` | :toilet: | `toilet` |
| :shower: | `shower` | :bathtub: | `bathtub` |
| :shopping_cart: | `shopping_cart` | | |

### 其它物品

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :smoking: | `smoking` | :coffin: | `coffin` |
| :funeral_urn: | `funeral_urn` | :moyai: | `moyai` |

## 符号

### 交通标识

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :atm: | `atm` | :put_litter_in_its_place: | `put_litter_in_its_place` |
| :potable_water: | `potable_water` | :wheelchair: | `wheelchair` |
| :mens: | `mens` | :womens: | `womens` |
| :restroom: | `restroom` | :baby_symbol: | `baby_symbol` |
| :wc: | `wc` | :passport_control: | `passport_control` |
| :customs: | `customs` | :baggage_claim: | `baggage_claim` |
| :left_luggage: | `left_luggage` | | |

### 警告

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :warning: | `warning` | :children_crossing: | `children_crossing` |
| :no_entry: | `no_entry` | :no_entry_sign: | `no_entry_sign` |
| :no_bicycles: | `no_bicycles` | :no_smoking: | `no_smoking` |
| :do_not_litter: | `do_not_litter` | :non-potable_water: | `:non-potable_water:` |
| :no_pedestrians: | `no_pedestrians` | :no_mobile_phones: | `no_mobile_phones` |
| :underage: | `underage` | :radioactive: | `radioactive` |
| :biohazard: | `biohazard` | | |

### 箭头

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :arrow_up: | `arrow_up` | :arrow_upper_right: | `arrow_upper_right` |
| :arrow_right: | `arrow_right` | :arrow_lower_right: | `arrow_lower_right` |
| :arrow_down: | `arrow_down` | :arrow_lower_left: | `arrow_lower_left` |
| :arrow_left: | `arrow_left` | :arrow_upper_left: | `arrow_upper_left` |
| :arrow_up_down: | `arrow_up_down` | :left_right_arrow: | `left_right_arrow` |
| :leftwards_arrow_with_hook: | `leftwards_arrow_with_hook` | :arrow_right_hook: | `arrow_right_hook` |
| :arrow_heading_up: | `arrow_heading_up` | :arrow_heading_down: | `arrow_heading_down` |
| :arrows_clockwise: | `arrows_clockwise` | :arrows_counterclockwise: | `arrows_counterclockwise` |
| :back: | `back` | :end: | `end` |
| :on: | `on` | :soon: | `soon` |
| :top: | `top` | | |

### 宗教

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :place_of_worship: | `place_of_worship` | :atom_symbol: | `atom_symbol` |
| :om: | `om` | :star_of_david: | `star_of_david` |
| :wheel_of_dharma: | `wheel_of_dharma` | :yin_yang: | `yin_yang` |
| :latin_cross: | `latin_cross` | :orthodox_cross: | `orthodox_cross` |
| :star_and_crescent: | `star_and_crescent` | :peace_symbol: | `peace_symbol` |
| :menorah: | `menorah` | :six_pointed_star: | `six_pointed_star` |

### 生肖

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :aries: | `aries` | :taurus: | `taurus` |
| :gemini: | `gemini` | :cancer: | `cancer` |
| :leo: | `leo` | :virgo: | `virgo` |
| :libra: | `libra` | :scorpius: | `scorpius` |
| :sagittarius: | `sagittarius` | :capricorn: | `capricorn` |
| :aquarius: | `aquarius` | :pisces: | `pisces` |
| :ophiuchus: | `ophiuchus` | | |

### 影像符号

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :twisted_rightwards_arrows: | `twisted_rightwards_arrows` | :repeat: | `repeat` |
| :repeat_one: | `repeat_one` | :arrow_forward: | `arrow_forward` |
| :fast_forward: | `fast_forward` | :next_track_button: | `next_track_button` |
| :play_or_pause_button: | `play_or_pause_button` | :arrow_backward: | `arrow_backward` |
| :rewind: | `rewind` | :previous_track_button: | `previous_track_button` |
| :arrow_up_small: | `arrow_up_small` | :arrow_double_up: | `arrow_double_up` |
| :arrow_down_small: | `arrow_down_small` | :arrow_double_down: | `arrow_double_down` |
| :pause_button: | `pause_button` | :stop_button: | `stop_button` |
| :record_button: | `record_button` | :cinema: | `cinema` |
| :low_brightness: | `low_brightness` | :high_brightness: | `high_brightness` |
| :signal_strength: | `signal_strength` | :vibration_mode: | `vibration_mode` |
| :mobile_phone_off: | `mobile_phone_off` | | |

### 数学

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :heavy_multiplication_x: | `heavy_multiplication_x` | :heavy_plus_sign: | `heavy_plus_sign` |
| :heavy_minus_sign: | `heavy_minus_sign` | :heavy_division_sign: | `heavy_division_sign` |

### 标点符号

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :bangbang: | `bangbang` | :interrobang: | `interrobang` |
| :question: | `question` | :grey_question: | `grey_question` |
| :grey_exclamation: | `grey_exclamation` | :exclamation: | `exclamation` <br /> `heavy_exclamation_mark` |
| :wavy_dash: | `wavy_dash` | | |

### 货币

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :currency_exchange: | `currency_exchange` | :heavy_dollar_sign: | `heavy_dollar_sign` |

### 按键符号

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :hash: | `hash` | :asterisk: | `asterisk` |
| :zero: | `zero` | :one: | `one` |
| :two: | `two` | :three: | `three` |
| :four: | `four` | :five: | `five` |
| :six: | `six` | :seven: | `seven` |
| :eight: | `eight` | :nine: | `nine` |
| :keycap_ten: | `keycap_ten` | | |

### 字母符号

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :capital_abcd: | `capital_abcd` | :abcd: | `abcd` |
| :1234: | `1234` | :symbols: | `symbols` |
| :abc: | `abc` | :a: | `a` |
| :ab: | `ab` | :b: | `b` |
| :cl: | `cl` | :cool: | `cool` |
| :free: | `free` | :information_source: | `information_source` |
| :id: | `id` | :m: | `m` |
| :new: | `new` | :ng: | `ng` |
| :o2: | `o2` | :ok: | `ok` |
| :parking: | `parking` | :sos: | `sos` |
| :up: | `up` | :vs: | `vs` |
| :koko: | `koko` | :sa: | `sa` |
| :u6708: | `u6708` | :u6709: | `u6709` |
| :u6307: | `u6307` | :ideograph_advantage: | `ideograph_advantage` |
| :u5272: | `u5272` | :u7121: | `u7121` |
| :u7981: | `u7981` | :accept: | `accept` |
| :u7533: | `u7533` | :u5408: | `u5408` |
| :u7a7a: | `u7a7a` | :congratulations: | `congratulations` |
| :secret: | `secret` | :u55b6: | `u55b6` |
| :u6e80: | `u6e80` | | |

### 几何符号

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :red_circle: | `red_circle` | :large_blue_circle: | `large_blue_circle` |
| :black_circle: | `black_circle` | :white_circle: | `white_circle` |
| :black_large_square: | `black_large_square` | :white_large_square: | `white_large_square` |
| :black_medium_square: | `black_medium_square` | :white_medium_square: | `white_medium_square` |
| :black_medium_small_square: | `black_medium_small_square` | :white_medium_small_square: | `white_medium_small_square` |
| :black_small_square: | `black_small_square` | :white_small_square: | `white_small_square` |
| :large_orange_diamond: | `large_orange_diamond` | :large_blue_diamond: | `large_blue_diamond` |
| :small_orange_diamond: | `small_orange_diamond` | :small_blue_diamond: | `small_blue_diamond` |
| :small_red_triangle: | `small_red_triangle` | :small_red_triangle_down: | `small_red_triangle_down` |
| :diamond_shape_with_a_dot_inside: | `diamond_shape_with_a_dot_inside` | :radio_button: | `radio_button` |
| :white_square_button: | `white_square_button` | :black_square_button: | `black_square_button` |

### 其它符合

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :recycle: | `recycle` | :fleur_de_lis: | `fleur_de_lis` |
| :trident: | `trident` | :name_badge: | `name_badge` |
| :beginner: | `beginner` | :o: | `o` |
| :white_check_mark: | `white_check_mark` | :ballot_box_with_check: | `ballot_box_with_check` |
| :heavy_check_mark: | `heavy_check_mark` | :x: | `x` |
| :negative_squared_cross_mark: | `negative_squared_cross_mark` | :curly_loop: | `curly_loop` |
| :loop: | `loop` | :part_alternation_mark: | `part_alternation_mark` |
| :eight_spoked_asterisk: | `eight_spoked_asterisk` | :eight_pointed_black_star: | `eight_pointed_black_star` |
| :sparkle: | `sparkle` | :copyright: | `copyright` |
| :registered: | `registered` | :tm: | `tm` |

## 旗帜

### 常用旗帜

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :checkered_flag: | `checkered_flag` | :triangular_flag_on_post: | `triangular_flag_on_post` |
| :crossed_flags: | `crossed_flags` | :black_flag: | `black_flag` |
| :white_flag: | `white_flag` | :rainbow_flag: | `rainbow_flag` |

### 国家和地区旗帜

| 图标 | 代码 | 图标 | 代码 |
| :-: | - | :-: | - |
| :andorra: | `andorra` | :united_arab_emirates: | `united_arab_emirates` |
| :afghanistan: | `afghanistan` | :antigua_barbuda: | `antigua_barbuda` |
| :anguilla: | `anguilla` | :albania: | `albania` |
| :armenia: | `armenia` | :angola: | `angola` |
| :antarctica: | `antarctica` | :argentina: | `argentina` |
| :american_samoa: | `american_samoa` | :austria: | `austria` |
| :australia: | `australia` | :aruba: | `aruba` |
| :aland_islands: | `aland_islands` | :azerbaijan: | `azerbaijan` |
| :bosnia_herzegovina: | `bosnia_herzegovina` | :barbados: | `barbados` |
| :bangladesh: | `bangladesh` | :belgium: | `belgium` |
| :burkina_faso: | `burkina_faso` | :bulgaria: | `bulgaria` |
| :bahrain: | `bahrain` | :burundi: | `burundi` |
| :benin: | `benin` | :st_barthelemy: | `st_barthelemy` |
| :bermuda: | `bermuda` | :brunei: | `brunei` |
| :bolivia: | `bolivia` | :caribbean_netherlands: | `caribbean_netherlands` |
| :brazil: | `brazil` | :bahamas: | `bahamas` |
| :bhutan: | `bhutan` | :botswana: | `botswana` |
| :belarus: | `belarus` | :belize: | `belize` |
| :canada: | `canada` | :cocos_islands: | `cocos_islands` |
| :congo_kinshasa: | `congo_kinshasa` | :central_african_republic: | `central_african_republic` |
| :congo_brazzaville: | `congo_brazzaville` | :switzerland: | `switzerland` |
| :cote_divoire: | `cote_divoire` | :cook_islands: | `cook_islands` |
| :chile: | `chile` | :cameroon: | `cameroon` |
| :cn: | `cn` | :colombia: | `colombia` |
| :costa_rica: | `costa_rica` | :cuba: | `cuba` |
| :cape_verde: | `cape_verde` | :curacao: | `curacao` |
| :christmas_island: | `christmas_island` | :cyprus: | `cyprus` |
| :czech_republic: | `czech_republic` | :de: | `de` |
| :djibouti: | `djibouti` | :denmark: | `denmark` |
| :dominica: | `dominica` | :dominican_republic: | `dominican_republic` |
| :algeria: | `algeria` | :ecuador: | `ecuador` |
| :estonia: | `estonia` | :egypt: | `egypt` |
| :western_sahara: | `western_sahara` | :eritrea: | `eritrea` |
| :es: | `es` | :ethiopia: | `ethiopia` |
| :eu: | `eu` <br /> `european_union` | :finland: | `finland` |
| :fiji: | `fiji` | :falkland_islands: | `falkland_islands` |
| :micronesia: | `micronesia` | :faroe_islands: | `faroe_islands` |
| :fr: | `fr` | :gabon: | `gabon` |
| :gb: | `gb` <br /> `uk` | :grenada: | `grenada` |
| :georgia: | `georgia` | :french_guiana: | `french_guiana` |
| :guernsey: | `guernsey` | :ghana: | `ghana` |
| :gibraltar: | `gibraltar` | :greenland: | `greenland` |
| :gambia: | `gambia` | :guinea: | `guinea` |
| :guadeloupe: | `guadeloupe` | :equatorial_guinea: | `equatorial_guinea` |
| :greece: | `greece` | :south_georgia_south_sandwich_islands: | `south_georgia_south_sandwich_islands` |
| :guatemala: | `guatemala` | :guam: | `guam` |
| :guinea_bissau: | `guinea_bissau` | :guyana: | `guyana` |
| :hong_kong: | `hong_kong` | :honduras: | `honduras` |
| :croatia: | `croatia` | :haiti: | `haiti` |
| :hungary: | `hungary` | :canary_islands: | `canary_islands` |
| :indonesia: | `indonesia` | :ireland: | `ireland` |
| :israel: | `israel` | :isle_of_man: | `isle_of_man` |
| :india: | `india` | :british_indian_ocean_territory: | `british_indian_ocean_territory` |
| :iraq: | `iraq` | :iran: | `iran` |
| :iceland: | `iceland` | :it: | `it` |
| :jersey: | `jersey` | :jamaica: | `jamaica` |
| :jordan: | `jordan` | :jp: | `jp` |
| :kenya: | `kenya` | :kyrgyzstan: | `kyrgyzstan` |
| :cambodia: | `cambodia` | :kiribati: | `kiribati` |
| :comoros: | `comoros` | :st_kitts_nevis: | `st_kitts_nevis` |
| :north_korea: | `north_korea` | :kr: | `kr` |
| :kuwait: | `kuwait` | :cayman_islands: | `cayman_islands` |
| :kazakhstan: | `kazakhstan` | :laos: | `laos` |
| :lebanon: | `lebanon` | :st_lucia: | `st_lucia` |
| :liechtenstein: | `liechtenstein` | :sri_lanka: | `sri_lanka` |
| :liberia: | `liberia` | :lesotho: | `lesotho` |
| :lithuania: | `lithuania` | :luxembourg: | `luxembourg` |
| :latvia: | `latvia` | :libya: | `libya` |
| :morocco: | `morocco` | :monaco: | `monaco` |
| :moldova: | `moldova` | :montenegro: | `montenegro` |
| :madagascar: | `madagascar` | :marshall_islands: | `marshall_islands` |
| :macedonia: | `macedonia` | :mali: | `mali` |
| :myanmar: | `myanmar` | :mongolia: | `mongolia` |
| :macau: | `macau` | :northern_mariana_islands: | `northern_mariana_islands` |
| :martinique: | `martinique` | :mauritania: | `mauritania` |
| :montserrat: | `montserrat` | :malta: | `malta` |
| :mauritius: | `mauritius` | :maldives: | `maldives` |
| :malawi: | `malawi` | :mexico: | `mexico` |
| :malaysia: | `malaysia` | :mozambique: | `mozambique` |
| :namibia: | `namibia` | :new_caledonia: | `new_caledonia` |
| :niger: | `niger` | :norfolk_island: | `norfolk_island` |
| :nigeria: | `nigeria` | :nicaragua: | `nicaragua` |
| :netherlands: | `netherlands` | :norway: | `norway` |
| :nepal: | `nepal` | :nauru: | `nauru` |
| :niue: | `niue` | :new_zealand: | `new_zealand` |
| :oman: | `oman` | :panama: | `panama` |
| :peru: | `peru` | :french_polynesia: | `french_polynesia` |
| :papua_new_guinea: | `papua_new_guinea` | :philippines: | `philippines` |
| :pakistan: | `pakistan` | :poland: | `poland` |
| :st_pierre_miquelon: | `st_pierre_miquelon` | :pitcairn_islands: | `pitcairn_islands` |
| :puerto_rico: | `puerto_rico` | :palestinian_territories: | `palestinian_territories` |
| :portugal: | `portugal` | :palau: | `palau` |
| :paraguay: | `paraguay` | :qatar: | `qatar` |
| :reunion: | `reunion` | :romania: | `romania` |
| :serbia: | `serbia` | :ru: | `ru` |
| :rwanda: | `rwanda` | :saudi_arabia: | `saudi_arabia` |
| :solomon_islands: | `solomon_islands` | :seychelles: | `seychelles` |
| :sudan: | `sudan` | :sweden: | `sweden` |
| :singapore: | `singapore` | :st_helena: | `st_helena` |
| :slovenia: | `slovenia` | :slovakia: | `slovakia` |
| :sierra_leone: | `sierra_leone` | :san_marino: | `san_marino` |
| :senegal: | `senegal` | :somalia: | `somalia` |
| :suriname: | `suriname` | :south_sudan: | `south_sudan` |
| :sao_tome_principe: | `sao_tome_principe` | :el_salvador: | `el_salvador` |
| :sint_maarten: | `sint_maarten` | :syria: | `syria` |
| :swaziland: | `swaziland` | :turks_caicos_islands: | `turks_caicos_islands` |
| :chad: | `chad` | :french_southern_territories: | `french_southern_territories` |
| :togo: | `togo` | :thailand: | `thailand` |
| :tajikistan: | `tajikistan` | :tokelau: | `tokelau` |
| :timor_leste: | `timor_leste` | :turkmenistan: | `turkmenistan` |
| :tunisia: | `tunisia` | :tonga: | `tonga` |
| :tr: | `tr` | :trinidad_tobago: | `trinidad_tobago` |
| :tuvalu: | `tuvalu` | :taiwan: | `taiwan` |
| :tanzania: | `tanzania` | :ukraine: | `ukraine` |
| :uganda: | `uganda` | :us: | `us` |
| :uruguay: | `uruguay` | :uzbekistan: | `uzbekistan` |
| :vatican_city: | `vatican_city` | :st_vincent_grenadines: | `st_vincent_grenadines` |
| :venezuela: | `venezuela` | :british_virgin_islands: | `british_virgin_islands` |
| :us_virgin_islands: | `us_virgin_islands` | :vietnam: | `vietnam` |
| :vanuatu: | `vanuatu` | :wallis_futuna: | `wallis_futuna` |
| :samoa: | `samoa` | :kosovo: | `kosovo` |
| :yemen: | `yemen` | :mayotte: | `mayotte` |
| :south_africa: | `south_africa` | :zambia: | `zambia` |
| :zimbabwe: | `zimbabwe` | | |
