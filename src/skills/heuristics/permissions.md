# Permissions

A permission is a question the operating system asks on the app's behalf, in a dialog the app cannot restyle, usually once. The app writes one sentence inside it and gets a word back. A wrong answer is expensive to reverse: the user has to leave the app, find it in a system settings list and come back, so most of them never do.

That makes the ask itself a design object. What is asked for at all, at which moment, after what explanation, and what the app becomes when the answer is no or half a yes.

`state-permission` already covers denial as a screen state. This file covers the request.

## <Rule id="perm-inventory" description="Every permission traces to a feature the user can point at" />

The declared set is public. On Android the Play listing shows it before install, on both platforms the system permission screen shows it after, and store review reads it against what the app claims to do. Each entry is a cost paid whether or not the prompt ever fires.

Name the feature behind each entry, and hold each class to its own standard: a runtime permission needs a feature the user can point at, an install-time one only has to be used at all. Anything left unnamed goes, including whatever a library, a template or a starter project dragged in: a dependency that declares location does not give the app a reason to have it. A permission for a feature that was removed leaves with the feature.

The source manifest is not the answer, because library permissions arrive through manifest merging and never appear in it. Read the merged manifest report under the build outputs, or the effective list on an installed build, and the `Info.plist` inside the built app rather than the one in the project.

## <Rule id="perm-ask-less" description="The right answer is usually a component that asks for nothing" />

Both platforms ship system UI that runs outside the app, hands back exactly what the user picked, and needs no permission at all. Reaching past it for the permission is the most common way an app asks for more than it needs.

| What the app needs | What it uses instead of a prompt |
|---|---|
| existing photos or videos | the system photo picker: no library authorization on iOS, none of the media permissions on Android, available from Android 11 and backported below it |
| a document or a file | the system document picker |
| a location for one task | the system location button on iOS; or, inside the standard dialog, the user's own "Allow Once" on iOS and "Only this time" on Android from Android 11 |

Raw access is for when the capture surface is the feature: a scanner drawing its own frame, a recorder showing its own level. Picking an existing image is never that.

Where library access is genuinely needed it is still partial: iOS has a limited state where the user chooses the visible subset, and Android 14 adds a selected-photos grant beside allow-all and deny. In both, what the app can see is a subset the user can change later, so the code reads a set that may shrink between launches.

- A subset is grown in place, not by asking again for everything. Re-open the picker for more items on Android; on iOS 18 `ContactAccessButton` and `contactAccessPicker(isPresented:completionHandler:)` widen a limited contacts grant with no prompt at all. Widening is the third answer beside grant and deny, and the only route out of a subset that turned out too small.
- An app on limited photo access owns its own re-prompt. Set `PHPhotoLibraryPreventAutomaticLimitedAccessAlert` and raise the selection change at the point the user is looking for more photos, or the system raises that alert at launch on the app's behalf and the user reads it as the app nagging.

## <Rule id="perm-scope" description="Ask for the level the feature uses, not the level that would be convenient" />

Every permission with a strong and a weak form gets the weak one first.

- Location, declared: coarse always, fine only where the feature genuinely benefits from it. Precise is defensible for turn-by-turn and pointless for a weather panel or a nearest-store list.
- Location, requested: accuracy is the user's choice inside one system dialog on both platforms, never a staged pair of asks. Android takes `ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION` in a single runtime request and ignores a fine-only one. Escalating to precise is that same paired request again on Android, and `requestTemporaryFullAccuracyAuthorization(withPurposeKey:)` on iOS, each carrying its own reason.
- Location, scope: when-in-use before always. Background location is its own later ask from Android 10, and it never rides along with the first one.
- Photos: add-only when the app only saves. That is a distinct key on iOS, and on Android from 10 writing through `MediaStore` needs no permission at all.
- Notifications and tracking are their own asks and travel with nothing.

An upgrade is requested the first time the stronger level is actually used, not at the moment the weaker one is granted.

## <Rule id="perm-rationale" description="The screen before the dialog is what earns the dialog" />

The system dialog is a yes or a no with one app-written sentence in it. Everything else the user needs in order to decide has to arrive before it, on a screen the app owns. The dialog is modal over the one surface the phone has: the feature it is asking about cannot be shown behind it, and a user who declines has nowhere else on screen to go, so the reduced form has to already be on the screen they were standing on.

That screen says three things: what the feature does, what the data is used for, and what the user gets. Then it offers two exits that both continue: a control that triggers the real dialog, and a decline that returns to the app with the feature in its reduced form.

- Read the current status before drawing anything. A rationale shown to someone who already granted is noise, and one shown to someone who can no longer be prompted is a lie. On Android `shouldShowRequestPermissionRationale` returning true means show the educational screen, and nothing more: it is false before the first ask as well as after a permanent denial, so it is not a test for either. Permanent denial is read from the request returning with no dialog shown, or from the platform status on iOS.
- It does not imitate the system alert. A fake dialog with Allow and Don't Allow teaches the user to dismiss the real one behind it.
- One rationale screen per feature, covering the permissions that one feature needs, and never a queue of asks chained across unrelated features. Where the platform requires or documents a bundle it goes out as one ask: paired location, or camera plus microphone for a single capture surface, through `RequestMultiplePermissions` on Android.
- It sits at the feature. A permission without which the app has no first screen at all may be asked for earlier, and then that screen has to make the reason obvious before the dialog appears.

## <Rule id="perm-purpose-string" description="The sentence inside the dialog is written, not generated" />

iOS drops the app's usage description into the system alert. The Android request API takes permission strings and nothing else, so there is nowhere for an app sentence to go and the rationale screen carries the entire explanation. Either way somebody writes copy.

An active sentence naming the feature and the use: "Records at night to detect snoring." Not "needed for a better experience", which says nothing, and not "Turn on microphone access", which restates the button.

On iOS every protected resource has its own key, and a missing one is not a warning: the access fails, the app is terminated on the spot, and review rejects the build. The seven in common use are `NSCameraUsageDescription`, `NSMicrophoneUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription`, `NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysAndWhenInUseUsageDescription` and `NSUserTrackingUsageDescription`. They are user-visible strings, so they localize, and they are as long as the language makes them.

## <Rule id="perm-answers" evidence="device" description="A permission has more than two answers" />

Granted or denied is the branch most code has. The states that exist:

- **granted**, and at what scope, because a yes to approximate is not a yes to precise;
- **denied and still askable**, which exists on Android and only there: the first Deny leaves a second chance, the second one spends it;
- **denied permanently**, where the dialog never appears again and the request call does nothing at all. On iOS a single Deny produces this, so the two denial branches are written once per platform rather than once for both;
- **not determined**, nobody asked yet, which is also where an expired one-time grant lands;
- **restricted**, where the device does not allow the user to grant it and no copy the app writes will change that.

Each is a different screen. Permanent denial is the one that gets folded into plain denied and produces a control that silently fails: the user taps Allow, no dialog appears, nothing moves, and the app has no explanation for it.

Partial grants belong here too. An approximate location, a single session of access, a subset of a library. The feature either runs on what it was given or names the part of itself that is missing, and a partial yes is never handled as a no.

## <Rule id="perm-recheck" evidence="device" description="A grant is a current value, not a fact" />

Check immediately before each access instead of caching the answer at launch.

The user can revoke anything from system settings while the app sits in the background, a one-time grant ends with the task and reverts to not determined rather than to denied, so the next touch of that feature is a fresh ask and not a settings route, the visible subset of a library changes without a prompt, and from Android 11 the system resets the runtime permissions of an app nobody has opened for a few months. A returning user can arrive without something they granted, through no decision either of you made.

The screen that assumes otherwise crashes, or shows an empty list where the content used to be and blames the server.

## <Rule id="perm-no-coercion" evidence="device" description="A no is an answer the app has to live with" />

`state-permission` owns the degraded screen and the route back into system settings. What that route must not turn into:

- No re-ask while the status is denied, and no ask the user did not trigger. On Android a prompt after a refusal spends the last chance the app had. A status of not determined at the next launch, including one an expired one-time grant left behind, is a first ask and belongs to `perm-rationale`.
- Nothing is held hostage. Content, a paid feature or a reward cannot be priced at a permission, and an unrelated feature is never gated on an unrelated permission. The App Store rules name notifications, location and tracking specifically; Play states the same prohibition generally and adds that the app must accommodate the user who says no.
- The note about what is missing sits where that feature's results would have been and names only the feature affected.
- Consent is withdrawn where it was given. Every permission the app holds is reachable from inside the app, as a link to the system page for it rather than a second switch, which is `set-system-owned`, and any consent the app stores itself, a tracking flag or an analytics opt-in, is turned off where `set-account-exit` puts it. Where the user has turned tracking off in Settings, a shortcut back there is allowed.

## <Rule id="perm-notify-ask" evidence="device" description="The notification prompt comes after the user makes something worth being told about" />

Consent is required before a single notification is sent, and this ask follows the same rule as the others: it belongs to the moment the user places the order, sets the reminder or follows the thread, not to the first screen.

- On Android it is a runtime permission from Android 13. An app targeting anything older loses control of the timing completely: the system raises the dialog itself the first time an activity starts once a notification channel exists, with no context at all, and a refusal there stands until the app is reinstalled or its target level reaches 33. Raising the target level is the fix, not a workaround.
- iOS has a provisional level that sends with no prompt, delivering quietly to the notification list where the user can keep it or turn it off. That is the honest way to earn the loud one.
- Promotional messages get their own opt-in inside the app, and the system grant is not it.

## <Rule id="perm-tracking" evidence="device" description="The tracking prompt exists only if the app actually tracks (iOS)" />

From iOS 14.5, linking this app's data to data other companies collected, or passing it to a data broker, needs the tracking prompt and its own usage description. Without a grant the advertising identifier comes back as all zeros.

An analytics or advertising SDK that pools users across other developers' apps counts even when the app never asks it to, so the dependency list decides this, not intent. No tracking means no prompt and no key. Tracking means the app still works whole when the answer is no: nothing withheld, nothing asked twice.

<Check>

<Verify rule="perm-inventory">Every entry in the merged manifest and in the built app's `Info.plist` names the feature that uses it, and every runtime one names a feature the user can point at.</Verify>
<Verify rule="perm-ask-less">No permission is requested for something a system picker or access button already returns without one, a partial grant is widened in place rather than re-asked, and the automatic limited-access alert is suppressed and replaced.</Verify>
<Verify rule="perm-scope">Each request asks for the weakest usable level, location goes out as the paired request, and always, precise and background are separate later asks.</Verify>
<Verify rule="perm-rationale">Each request is preceded by an app-owned screen stating use and benefit, gated on the current status, with a decline that continues except on the first-run required-resource screen `onboard-ask-order` defines, and one screen per feature rather than a queue.</Verify>
<Verify rule="perm-purpose-string">Every usage description is an active sentence naming the feature and the use rather than restating the button.</Verify>
<Verify rule="perm-answers">The code branches on permanent denial and on partial grants, not on a granted boolean.</Verify>
<Verify rule="perm-recheck">Permission status is read at the point of access, never cached from launch.</Verify>
<Verify rule="perm-no-coercion">No re-prompt while the status is denied, no feature or content gated on an unrelated grant, and every permission and stored consent the app holds is reversible from inside it.</Verify>
<Verify rule="perm-notify-ask">The notification request follows a user action that creates something to notify about, not app start.</Verify>
<Verify rule="perm-tracking">On iOS a tracking prompt exists if and only if a dependency tracks, and denial changes no feature; a codebase that ships only to Android answers this not applicable.</Verify>

<Device>Run the last five with the permission revoked and the app cold started, because every one of them passes on a device where the grant is already in place. Reach each state on purpose rather than waiting to meet it: on Android, `adb shell dumpsys package PACKAGE_NAME` reports the flags per permission, where `USER_SET` is one denial and `USER_FIXED` is the permanent one, and `adb shell pm clear-permission-flags PACKAGE_NAME PERMISSION_NAME user-set user-fixed` resets between runs; on iOS, Reset Location & Privacy returns every permission to not determined. A state nobody can enter deliberately gets answered from the granted device every time, which is the same as not running the check.</Device>

</Check>
