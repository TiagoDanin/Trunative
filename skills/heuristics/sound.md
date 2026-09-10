# Sound

Sound the app makes on its own: a tap tone, a success chime, an error beep, a loop under a screen. It is the only output the app has that reaches people who never installed it, so the cost is paid by the room and the benefit is collected by one person. A phone is carried into meetings, waiting rooms, buses and bedrooms, and silencing it is what people do on the way in.

The player and the audio somebody pressed play on are `media-system-player` and `media-unasked-sound`. The sound attached to a notification is fixed on its channel, which is `notify-channels` and `notify-level`. Haptics are `touch-feedback` and `sense-haptic`. What is left, the noise the interface makes by itself, is this file, and for most apps the right size of it is zero.

## <Rule id="sound-inventory" description="A short list with fixed meanings, and an empty list is a legitimate answer" />

Write the set down in `STACK.md` before any of it is coded: the event, what the sound means, and what the screen shows at the same moment. Every play site in the code maps to one entry, and nothing plays that is not in it.

- One sound per meaning and one meaning per sound. Two samples that both mean "done" teach nothing, and one sample doing duty for saved and for deleted teaches the wrong thing.
- Frequency decides what survives. The more often an action happens, the worse a sound on it ages, so the first cuts are the ones on taps, scroll, keystrokes, screen changes and content arriving. What is left is rare and consequential: a payment sent, a scan matched, a timer that has run out while the phone was face down. The exception is a control whose platform behaviour already includes a sound, a keyboard key, a dialpad or a shutter: that one is played through the platform's own gated API (`sound-system-sound`) and counts as one entry rather than one per press.
- A sound is worth its slot only when the user's eyes may be elsewhere. Anything confirming something already visible on screen is decoration, and `fb-silent-success` has already ruled on it.
- Nothing plays while the app is not the thing on screen. Sound coming out of a screen nobody is looking at is a notification wearing the wrong clothes, and a notification is silenceable per kind while this is not.

## <Rule id="sound-silenced" description="One platform settles it with a category, the other leaves most of it to the app" />

On iOS the answer is the audio session category, chosen once for the app rather than branched on at each play site.

| Category | Hardware silent switch | Other apps' audio |
|---|---|---|
| `.ambient` | silences the app | mixes with it |
| `.soloAmbient`, the default | silences the app | takes the output |
| `.playback` | keeps playing | mixes only if the option is set |

Interface sound is `.ambient`. `.playback` survives the hardware switch and belongs to the two cases `media-unasked-sound` owns, neither of which is interface sound. Picking it for a chime is the app deciding the hardware switch does not apply to it. Note that the silent-switch half of `.ambient` is already what the `.soloAmbient` default gives you, so the thing `.ambient` is actually chosen for is mixing, which is `sound-mixes`.

Android has no session category, and no single user gesture answers the same question for an app's own sound. Do Not Disturb at total silence is the case that does reach it: under `INTERRUPTION_FILTER_NONE` every audio stream except a phone call is muted along with the notifications and the vibration. The ringer mode and the volume keys act on streams rather than on a category the app declared once, so between those the discipline is largely the app's own. Two things exist to use:

- `Settings.System.SOUND_EFFECTS_ENABLED`, the user's own toggle for interface sound. `View.playSoundEffect` and the `AudioManager.playSoundEffect(int)` overload fire only when it is on. The overload that takes an explicit volume, `playSoundEffect(int, float)`, carries no such gate, so it is read against the setting like any sample the app plays through its own player. That reading happens before the sound plays, or the app is the one noise left on a phone where the user switched interface sound off.
- `AudioAttributes` built with `USAGE_ASSISTANCE_SONIFICATION` and `CONTENT_TYPE_SONIFICATION`, which is how the system is told this is interface sound. Untagged, it is filed as media and treated as media.

Sound and haptics are not gated the same way there, and a helper that switches both on one flag is wrong on one of them. Sound still asks: the framework's own click checks the user's setting, and an app-played sample has to. Vibration no longer does, because the setting behind it was deprecated at API 33 in favour of vibration usages the system applies on the app's behalf.

The app never sets the system volume or the ringer mode. On iOS the system volume governs what leaves the speaker, and repurposing the volume buttons or defeating the Ring/Silent switch is an App Store rejection rather than a taste question. On Android the APIs to move both exist and only a ringer change that would toggle Do Not Disturb is gated, behind Notification Policy Access, so there the rule is discipline rather than a wall and a reviewer should expect to find the call rather than a compile error. Balancing one of the app's own sounds against another is fine, so a sound that is too quiet is mixed too quiet rather than fixed by turning the device up.

The decision is made once, at the level where the platform exposes it, and never as a runtime test of whether the phone happens to be silenced right now. Code that plays a sound only after inspecting the ringer or the mute state has moved a system guarantee into a branch that will be wrong on some device, some launch, or some version.

## <Rule id="sound-mixes" evidence="device" description="A chime lands on top of whatever is already coming out of the speaker" />

The failure is loud and the documented default is the one that produces it. `.soloAmbient` is the default iOS category and it does not mix, so an app that never states a category can put its first chime through a podcast that then does not come back. Say which category the app uses rather than inheriting one.

- Interface sound mixes. On iOS that is the `.ambient` category. On Android it is a sonification-tagged sample short enough to be over before it could duck anything, so it rides alongside the music rather than competing for it. Nothing outside a player is worth taking the output for.
- A UI sound never activates and deactivates a session around itself. Whether a sample has to hold audio focus at all on a current Android is a playback question, and `media-focus` owns it along with the gains, the losses and the ducking.
- A sound has no route back. If the other app's music is quieter after the chime, or gone, the category is the first place to look: a non-mixing `.soloAmbient`, a `.playback` with the mixing option unset, or a focus request that should not have been made. Where a session really is being activated around the sound, the missing deactivation belongs to `media-unasked-sound`.
- Test it the way it will happen: start music in another app, then use the screen. Every sound the app makes should land on top of that music without changing it, and the music should be at the same level when the screen is closed.

## <Rule id="sound-system-sound" description="Play the platform's sound before shipping one" />

The system already has the sounds for the actions the system invented, and its versions are the ones the user recognises from every other app on the phone.

- iOS: Audio Services for short sounds. Android: `View.playSoundEffect` with `SoundEffectConstants.CLICK`, which arrives already gated on the user's setting. Flutter reaches a deliberately small set through `SystemSound.play`, where `click` is the value that carries on phones and the others are documented as platform-limited, so confirm one runs on both before an action depends on it.
- Shipping a sample for a key press, a lock, a shutter or a click replaces something recognised with something that is not, and every asset is download size the user sees before any of the design (`perf-size`).
- The constraints on the short-sound path are real: through iOS Audio Services the file is at most 30 seconds, linear PCM or IMA4, packaged as `.caf`, `.aif` or `.wav`, with no volume control, no looping, no stereo placement, and one sound at a time. An mp3 is not a supported format there. That path also plays on the device speakers without audio routing, so the chime comes out of the phone rather than the headphones the user is wearing, which on its own decides whether it suits the sound. Anything richer is an audio session, which is `media-unasked-sound`.
- Mobile web has neither a system sound to borrow nor an interface-sound setting to read. Audio there is gated on the user having interacted with the page, so a sound not started from a touch may never fire at all, and a build that ships to the browser as well carries the signal on the screen and treats the sound as the part that may be missing.
- A sound on a repeated action is varied per play in pitch and level rather than shipped as one identical sample. The system does exactly that for the keyboard, and it is why forty taps in a row stay bearable.
- A haptic beside a sound is written, not inherited. The iOS alert-sound path vibrates only where the user has switched vibration on for the ringer, and drops the vibration entirely while the session is set to `.record` or `.playAndRecord`, so an app that leans on it for the felt half of a signal loses that half on two ordinary devices. Pair the sound with a feedback generator explicitly, under `sense-haptic`.

## <Rule id="sound-never-alone" evidence="device" description="Design the screen muted, then decide whether to add sound" />

An install may never hear any of it: the phone is silenced, muted, in a pocket, on a table across the room, or held by somebody who cannot hear it. `a11y-media` and `color-not-alone` set the law; the working rule is the order in which the screen gets built.

Build and review it with the device muted first, so nothing on it depends on being heard. A chime firing alongside a snackbar is an addition. A chime firing instead of one is a state that was never drawn, and `fb-reach` calls that undelivered. A sound and a haptic are not substitutes for each other either, since either can be switched off on its own.

The two places this breaks are worth naming, because both look finished on a developer's desk with the volume up. A failure that beeps and changes nothing on screen leaves the user tapping again. A long operation that announces its end with a sound and no visible completion leaves someone who put the phone down with no way to find out it worked, which is the exact situation the sound was added for.

## <Rule id="sound-unasked" description="Nothing starts making noise because a screen opened" />

Sound follows a touch. Launching, arriving at a screen, a card scrolling into view, a fanfare over a result nobody asked to celebrate: each one plays into a room the app cannot see, and it lands on whoever is nearest rather than on the user.

- Where a soundtrack or an ambient loop is genuinely the point, it starts from a control the user reaches on the first screen, not before it, and stopping it is one step from anywhere it can be heard.
- Audio that does start by itself owes a control that stops it, or its own volume separate from the system's. On the web that is an accessibility floor rather than a courtesy, and WCAG puts the line at anything running past 3 seconds. Native publishes no number, so take the same 3 seconds as the working one, and it applies to a splash animation and a game menu alike.
- Whether a media surface may start by itself is `motion-autoplay`, and claiming the speaker at launch is `media-unasked-sound`. The addition here is that outside a player there is no case for it at all.

## <Rule id="sound-off-switch" description="One switch, in the place that already owns the sound" />

An app-level control is right only where nothing above it can turn the sound off. A click played through the framework's effect API already obeys the user's system setting, and a notification's sound is not this file's to switch at all: `notify-channels` owns it on both platforms, including the iOS half where the per-kind control does belong inside the app. Duplicating a control the system already offers is the bug `set-system-owned` names.

- Samples the app plays itself are the case that needs one: a single switch for the app's own sound, sitting beside what it affects, read by every play site (`set-wired`), and persisted across launches.
- One switch for the whole set, not one per event. A set small enough to defend under `sound-inventory` is small enough to turn off as a unit, and a sound settings screen with six rows is the inventory admitting it is too long.
- A better default is cheaper than a switch (`set-default-first`). Where the sound is decoration rather than a signal, that default is off, and the switch exists for the people who want it back.

## Check

Review answers each of these against the code, pointing at the line:

- Every play site maps to an entry in a written set of sounds, each with one meaning, and a sound on a frequent event survives only where it is the platform's own behaviour for that control, played through the platform's gated API. `sound-inventory`
- iOS interface sound uses `.ambient` rather than `.playback`, Android tags it as sonification and reads the user's interface-sound setting before playing its own sample, and nothing in the app changes the system volume or the volume buttons. `sound-silenced`
- The audio session is configured rather than left at the default, no play site activates a session or requests focus around a UI sound, and other apps' audio is at the level it was at before. `sound-mixes`
- Recognised system actions use the platform's own sound, and any shipped asset meets the format limits of the API playing it and varies when it repeats. `sound-system-sound`
- Every play site sits beside a visible state change, and the screen was built and reviewed muted. `sound-never-alone`
- No sound starts on launch, on navigation or on content appearing, and anything self-starting past 3 seconds has a stop control or its own volume. `sound-unasked`
- Sound the system cannot already silence has exactly one in-app switch, wired into every play site and persisted, and nothing duplicates a control the system already offers. `sound-off-switch`

Two of those halves are not answerable from a diff. Whether other apps' audio comes back at the level it was at, and whether the muted screen still carries every signal, are settled on a device with music playing and the volume down; what the code can show is the half stated before each of them, that no play site claims a session or focus and that every play site has a visible state change beside it.
